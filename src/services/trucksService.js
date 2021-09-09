'use strict';

const { Truck } = require('../models/truckModel');
const { InvalidRequestError } = require('../utils/errors');

const getDriverTrucksByDriverId = async (userId) => {
  const driverTrucks = await Truck.find({ created_by: userId });
  return driverTrucks;
};

const addTruckToDriver = async (driverId, truckPayload) => {
  if (truckPayload.type === 'SPRINTER') {
    truckPayload.payload = 1700;
    truckPayload.dimensions = {
      width: 300,
      length: 250,
      height: 170,
    };
    const truck = new Truck({ ...truckPayload, driverId });
    await truck.save();
  }

  if (truckPayload.type === 'SMALL STRAIGHT') {
    truckPayload.payload = 2500;
    truckPayload.dimensions = {
      width: 500,
      length: 250,
      height: 170,
    };
    const truck = new Truck({ ...truckPayload, driverId });
    await truck.save();
  }

  if (truckPayload.type === 'LARGE STRAIGHT') {
    truckPayload.payload = 4000;
    truckPayload.dimensions = {
      width: 700,
      length: 350,
      height: 200,
    };
    const truck = new Truck({ ...truckPayload, driverId });
    await truck.save();
  }
};

const getTruckByIdForDriver = async (truckId, driverId) => {
  const truck = await Truck.findOne({ _id: truckId, created_by: driverId });

  if (!truck) {
    throw new InvalidRequestError('No truck with such id found');
  }

  return truck;
};

const updateTruckByIdForDriver = async (truckId, driverId, type) => {
  const truck = await Truck.findOne({ _id: truckId, created_by: driverId });

  if (!truck) {
    throw new InvalidRequestError('No truck with such id found');
  }

  if (truck.assigned_to) {
    throw new InvalidRequestError(
        `You can\'t update truck info, while it assigned`);
  }

  await truck.updateOne({ $set: { type } });
};

const deleteTruckByIdForDriver = async (truckId, driverId) => {
  const truck = await Truck.findOne({ _id: truckId, created_by: driverId });

  if (!truck) {
    throw new InvalidRequestError('No truck with such id found');
  }

  if (truck.assigned_to) {
    throw new InvalidRequestError(
        `You can\'t update truck info, while it assigned`);
  }

  await truck.remove();
};

const assignTruckByIdForDriver = async (truckId, driverId) => {
  const assignedTruck = await Truck.findOne(
      { created_by: driverId, assigned_to: driverId },
  );

  if (assignedTruck && assignedTruck.status === 'OL') {
    throw new InvalidRequestError('You can\'t assing another truck', 403);
  }

  await Truck.findOneAndUpdate(
      { created_by: driverId, assigned_to: driverId },
      { $set: { assigned_to: null } },
  );

  const truck = await Truck.findOneAndUpdate(
      { _id: truckId, created_by: driverId },
      { $set: { assigned_to: driverId } },
  );

  if (!truck) {
    throw new InvalidRequestError('No truck with such id found');
  }
};

module.exports = {
  getDriverTrucksByDriverId,
  addTruckToDriver,
  getTruckByIdForDriver,
  updateTruckByIdForDriver,
  deleteTruckByIdForDriver,
  assignTruckByIdForDriver,
};
