const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const colors = require('colors');
const rfs = require('rotating-file-stream');
const path = require('path');
const morgan = require('morgan');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const logger = require('./middleware/logger');
const categoriesRouter = require('./routes/categories');
const lessonsRouter = require('./routes/lessons');
const usersRouter = require('./routes/users');
const newsRouter = require('./routes/news');
const safetyRouter = require('./routes/safety');
const commentRouter = require('./routes/comments');
const errorHandler = require('./middleware/errorHandler');

dotenv.config({ path: './config/config.env' });

const app = express();

connectDB();

const accessLogStream = rfs.createStream('access.log', {
    interval: '1d', // нэг өдөр
    path: path.join(__dirname, 'log'),
});


app.use(cookieParser()); //req.cookies
app.use(logger);
app.use(morgan('combined', { stream: accessLogStream }));
app.use(express.json());
app.use(fileUpload());
app.use(cors());

app.use('/api/v1/categories', categoriesRouter);
app.use('/api/v1/lessons', lessonsRouter);
app.use('/api/v1/user', usersRouter);
app.use('/api/v1/news', newsRouter);
app.use('/api/v1/safety', safetyRouter);
app.use('/api/v1/comments', commentRouter);

app.use(express.static(path.join(__dirname, "image")));
app.use(express.static(path.join(__dirname, "pdf")));
app.use(express.static(path.join(__dirname, "public")));
// if (process.env.NODE_ENV === 'production') {
//     app.use(express.static(path.join(__dirname, 'build')));
//     app.get('/*', function (req, res) {
//         console.log(`index file ogch bna.........`)
//         res.sendFile(path.join(__dirname, 'build', 'index.html'));
//     });
// };

app.use(errorHandler);

const server = app.listen(process.env.PORT, console.log(`EXPRESS сэрвэр ${process.env.PORT} порт дээр аслаа...`.rainbow));

process.on("unhandledRejection", (err, promise) => {
    console.log(`Алдаа гарлаа: ${err.message}`.red.underline.bold);
    server.close(() => {
        process.exit(1);
    });
});

