'use strict';

const {Load} = require('../models/loadModel');
const {Truck} = require('../models/truckModel');
const {InvalidRequestError} = require('../utils/errors');

const getLoadsForUser = async ({
  userId, role, limit = 10,
  offset = 0, status = {$ne: null},
}) => {
  if (role === 'SHIPPER') {
    const loads = await Load.find({created_by: userId, status: status})
        .limit(Number(limit))
        .skip(Number(offset));
    return loads;
  }

  if (role === 'DRIVER') {
    const activeLoad = await Load.findOne({
      assigned_to: userId,
      status: 'ASSIGNED',
    })
        .limit(Number(limit))
        .skip(Number(offset));
    const completedLoads = await Load.find({
      assigned_to: userId,
      status: 'SHIPPED',
    })
        .limit(Number(limit))
        .skip(Number(offset));
    return [activeLoad, ...completedLoads];
  }
};

const addLoadToShipper = async (shipperId, loadPayload) => {
  const load = new Load({...loadPayload, shipperId});
  await load.save();
};

const getActiveLoadForDriver = async (driverId) => {
  const activeLoad = await Load.findOne({
    assigned_to: driverId,
    status: 'ASSIGNED',
  });

  if (!activeLoad) {
    return 'No active load';
  }

  return activeLoad;
};

const postShipperLoad = async (loadId, shipperId) => {
  const load = await Load.findOne({_id: loadId, created_by: shipperId});

  if (!load) {
    throw new InvalidRequestError('No load with such id');
  }

  load.status = 'POSTED';
  await load.save();

  const assignedTrucks = await Truck.find({assigned_to: {$ne: null}});

  assignedTrucks.some(async (truck) => {
    if (
      truck.status === 'IS' &&
      truck.payload > load.payload &&
      truck.dimensions.length > load.dimensions.length &&
      truck.dimensions.height > load.dimensions.height
    ) {
      truck.status = 'OL';
      load.assigned_to = truck.assigned_to;
      load.status = 'ASSIGNED';
      load.state = 'En route to Pick Up';
      load.logs.push({
        message: `Load assigned to driver with id ${truck.assigned_to}`,
        time: new Date(Date.now()),
      });
      await load.save();
      await truck.save();
      return true;
    }
  });

  if (load.assigned_to) {
    return {
      message: 'Load posted successfully',
      driver_found: true,
    };
  }

  if (!load.assigned_to) {
    load.status = 'NEW';
    load.logs.push({
      message: `Driver not found`,
      time: new Date(Date.now()),
    });
    await load.save();
    return {
      message: 'Driver not found',
      driver_found: false,
    };
  }
};

const iterateLoadState = async (driverId) => {
  const states = [
    'En route to Pick Up',
    'Arrived to Pick Up',
    'En route to Delivery',
    'Arrived to Delivery',
  ];
  const load = await Load.findOne({assigned_to: driverId, status: 'ASSIGNED'});
  const truck = await Truck.findOne({assigned_to: driverId});

  if (!load) {
    throw new InvalidRequestError('No active load');
  }

  states.some((state, index, array) => {
    if (load.state === state && index < array.length - 1) {
      load.state = states[index + 1];
      return true;
    }
  });

  if (load.state === 'Arrived to Delivery') {
    load.status = 'SHIPPED';
    truck.status = 'IS';
  }

  await load.save();
  await truck.save();
  return load.state;
};

const getLoadByIdForUser = async (loadId, userId) => {
  const load = await Load.findOne({_id: loadId, created_by: userId});

  if (!load) {
    throw new InvalidRequestError('No load with such id found');
  }

  return load;
};

const updateLoadByIdForUser = async (loadId, userId, data) => {
  const load = await Load.findOne({_id: loadId, created_by: userId});

  if (!load) {
    throw new InvalidRequestError('No load with such id found');
  }

  if (load.status !== 'NEW') {
    throw new InvalidRequestError('You can\'t update this load');
  }

  await load.updateOne({$set: data});
};

const deleteLoadByIdForUser = async (loadId, userId) => {
  const load = await Load.findOne({_id: loadId, created_by: userId});

  if (!load) {
    throw new InvalidRequestError('No load with such id found');
  }

  if (load.status !== 'NEW') {
    throw new InvalidRequestError('You can\'t delete this load');
  }

  await load.remove();
};

const getShippingInfoByIdForUser = async (loadId, userId) => {
  const load = await Load.findOne(
      {_id: loadId, created_by: userId, status: 'ASSIGNED'},
  );

  if (!load) {
    throw new InvalidRequestError('No load with such id found');
  }

  const truck = await Truck.findOne({
    assigned_to: load.assigned_to,
  });

  return {load, truck};
};

module.exports = {
  getLoadsForUser,
  addLoadToShipper,
  getActiveLoadForDriver,
  postShipperLoad,
  iterateLoadState,
  getLoadByIdForUser,
  updateLoadByIdForUser,
  deleteLoadByIdForUser,
  getShippingInfoByIdForUser,
};
