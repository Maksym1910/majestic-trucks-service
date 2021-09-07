'use strict';

const express = require('express');
const router = new express.Router();

const {asyncWrapper} = require('../utils/apiUtils');
const {
  getDriverTrucksByDriverId,
  addTruckToDriver,
  getTruckByIdForDriver,
  updateTruckByIdForDriver,
  deleteTruckByIdForDriver,
  assignTruckByIdForDriver,
} = require('../services/trucksService');
const {
  trucksTypeValidator,
} = require('../middlewares/validationMiddleware');

router.get(
    '/',
    asyncWrapper(async (request, response) => {
      const {userId} = request.user;
      const driverTrucksInfo = await getDriverTrucksByDriverId(userId);
      response.json({trucks: driverTrucksInfo});
    }),
);

router.post(
    '/',
    trucksTypeValidator,
    asyncWrapper(async (request, response) => {
      const {userId} = request.user;
      const truckPayload = {
        type: request.body.type,
        created_by: userId,
      };

      await addTruckToDriver(userId, truckPayload);
      response.json({message: 'Truck created successfully'});
    }),
);

router.get(
    '/:id',
    asyncWrapper(async (request, response) => {
      const {userId} = request.user;
      const {id} = request.params;

      const truck = await getTruckByIdForDriver(id, userId);

      response.json({truck});
    }),
);

router.put(
    '/:id',
    trucksTypeValidator,
    asyncWrapper(async (request, response) => {
      const {userId} = request.user;
      const {id} = request.params;
      const {type} = request.body;

      await updateTruckByIdForDriver(id, userId, type);
      response.json({message: 'Truck details changed successfully'});
    }),
);

router.delete(
    '/:id',
    asyncWrapper(async (request, response) => {
      const {userId} = request.user;
      const {id} = request.params;

      await deleteTruckByIdForDriver(id, userId);
      response.json({message: 'Truck deleted successfully'});
    }),
);

router.post(
    '/:id/assign',
    asyncWrapper(async (request, response) => {
      const {userId} = request.user;
      const {id} = request.params;

      await assignTruckByIdForDriver(id, userId);
      response.json({message: 'Truck assigned successfully'});
    }),
);

module.exports = {
  trucksRoute: router,
};
