const catchAsync = require("../utils/catchAsync");
const Address = require("./../models/addressModel");

exports.getAllAddresses = async (req, res, next) => {
  try {
    const addreses = await Address.find();

    res.status(200).json({
      status: "success",
      results: addreses.length,
      data: {
        addreses,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.createAddress = catchAsync(async (req, res, next) => {
  if (!req.body.user) {
    req.body.user = req.user._id;
  }

  const address = await Address.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      address,
    },
  });
});

exports.getAddress = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const address = await Address.findById(id);

  res.status(200).json({
    status: "success",
    data: {
      address,
    },
  });
});

exports.updateAddress = catchAsync(async () => {
  const id = req.params.id;
  const address = await Address.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      address,
    },
  });
});

exports.deleteAddress = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  await Address.findByIdAndDelete(id);

  res.status(204).json({
    status: "success",
    data: null,
  });
});
