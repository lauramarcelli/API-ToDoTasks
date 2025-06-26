const express = require ('express');

exports.errorMiddleware = (err, req, res, next) => {
    console.error('Error', err.message);
    res.status(500).json({
        error: 'Algo ocurrió en el servidor',
    })}