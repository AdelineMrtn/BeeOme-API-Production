'use strict';

const moment = require('moment');
const datas = require('./production.json');
const Hapi = require('@hapi/hapi');

const init = async () => {

    const server = Hapi.server({
        port: 3004,
        host: 'localhost',
        routes: {
            cors: {
                origin:['*'],
                headers: ["Accept", "Content-Type"],
                additionalHeaders: ["X-Requested-With"]
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/status',
        handler: (request, h) => {
            return 'Service production: ok';
        }
    });

    server.route({
        method: 'GET',
        path: '/lastProduction',
        handler: (request, h) => {
            return datas[datas.length - 1];
        }
    });

    server.route({
        method: 'GET',
        path: '/productionByWeek',
        handler: (request, h) => {
            return datas.filter((el)=>{
                return el.date > moment().startOf('week').add(1, 'day').format('YYYY-MM-DD HH:mm:ss') && el.date < moment().endOf('week').add(1, 'day').format('YYYY-MM-DD HH:mm:ss') 
            });
        }
    });

    server.route({
        method: 'GET',
        path: '/productionByMonth',
        handler: (request, h) => {
            return datas.filter((el)=>{
                return el.date > moment().startOf('month').format('YYYY-MM-DD HH:mm:ss') && el.date < moment().endOf('month').format('YYYY-MM-DD HH:mm:ss') 
            });
        }
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();