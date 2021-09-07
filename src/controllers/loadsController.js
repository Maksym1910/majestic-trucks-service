'use strict';

const express = require('express');
const router = new express.Router();

const {asyncWrapper} = require('../utils/apiUtils');
const {
  getLoadsForUser,
  addLoadToShipper,
  getActiveLoadForDriver,
  postShipperLoad,
  iterateLoadState,
  getLoadByIdForUser,
  updateLoadByIdForUser,
  deleteLoadByIdForUser,
  getShippingInfoByIdForUser,
} = require('../services/loadsService');
const {
  loadValidator,
} = require('../middlewares/validationMiddleware');
const {
  isShipper,
  isDriver,
} = require('../middlewares/roleCheckMiddleware');

router.get(
    '/',
    asyncWrapper(async (request, response) => {
      const {
        userId,
        role,
      } = request.user;
      const {
        limit,
        offset,
        status,
      } = request.query;

      const loads = await getLoadsForUser({
        userId, role, limit,
        offset, status,
      });
      response.json({loads});
    }),
);

router.post(
    '/',
    isShipper,
    loadValidator,
    asyncWrapper(async (request, response) => {
      const {userId} = request.user;
      const loadPayload = {
        ...request.body,
        created_by: userId,
      };

      await addLoadToShipper(userId, loadPayload);
      response.json({message: 'Load created successfully'});
    }),
);

router.get(
    '/active',
    isDriver,
    asyncWrapper(async (request, response) => {
      const {userId} = request.user;

      const load = await getActiveLoadForDriver(userId);

      response.json({load});
    }),
);

router.post(
    '/:id/post',
    isShipper,
    asyncWrapper(async (request, response) => {
      const {userId} = request.user;
      const {id} = request.params;

      const result = await postShipperLoad(id, userId);
      response.json(result);
    }),
);

router.patch(
    '/active/state',
    isDriver,
    asyncWrapper(async (request, response) => {
      const {userId} = request.user;

      const loadState = await iterateLoadState(userId);
      response.json({message: `Load state changed to '${loadState}'`});
    }),
);

router.get(
    '/:id',
    isShipper,
    asyncWrapper(async (request, response) => {
      const {userId} = request.user;
      const {id} = request.params;

      const load = await getLoadByIdForUser(id, userId);
      response.json({load});
    }),
);

router.put(
    '/:id',
    isShipper,
    loadValidator,
    asyncWrapper(async (request, response) => {
      const {userId} = request.user;
      const {id} = request.params;

      await updateLoadByIdForUser(id, userId, request.body);
      response.json({message: 'Load details changed successfully'});
    }),
);

router.delete(
    '/:id',
    isShipper,
    asyncWrapper(async (request, response) => {
      const {userId} = request.user;
      const {id} = request.params;

      await deleteLoadByIdForUser(id, userId);
      response.json({message: 'Load deleted successfully'});
    }),
);

router.get(
    '/:id/shipping_info',
    isShipper,
    asyncWrapper(async (request, response) => {
      const {userId} = request.user;
      const {id} = request.params;

      const shippingInfo = await getShippingInfoByIdForUser(id, userId);
      response.json(shippingInfo);
    }),
);

module.exports = {
  loadsRoute: router,
};
