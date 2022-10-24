
const errorHandler = (err, req, res, next) => {
    console.log(err.stack.red.underline);

    const error = { ...err };

    error.message = err.message;

    if (error.name === "CastError") {
        error.message = "Энэ буруу бүтэцтэй байна";
        error.statusCode = 400;
    };

    if (error.message === "jwt malformed") {
        error.message = "Та заавал логин хийнэ үүү... SEK";
        error.statusCode = 401;
    };

    if (error.code === 11000) {
        error.message = "Талбарын утга давхардсан байна.";
        error.statusCode = 400;
    }

    res.status(err.statusCode || 500).json({
        success: false,
        error,
    });

};

module.exports = errorHandler;

