const { response } = require('express');
const { request } = require('http');
const path = require('path');
const Mensaje = require('../Models/Messages.models');

exports.get = (request, response, next) => {
    response.sendFile(path.join(__dirname, '..', 'views', 'AboutMe.html'))};


exports.post = (request, response, next) => {
    const nuevo = new Mensaje({
        fname: request.body.fname,
        lname: request.body.lname,
        email: request.body.email,
        Planguage: request.body.Planguage,
        message: request.body.message,
    });
    nuevo.save();

    let cookies = request.get('Cookie');
    let contador;


    if (typeof cookies === 'string'){
        if (cookies.includes('consultas')){
            contador =  Number.parseInt(cookies.split(';')[1].split('=')[1]);
        }
    }
     else {
        contador = 0;
    }
    contador++;

    request.session.email = nuevo.email;
    
    response.setHeader('Set-Cookie', [`ultimo_mensaje=${nuevo.fname}; HttpOnly`, `consultas=${contador}; HttpOnly`]);
    response.redirect('/AboutMe/Portfolio');
}

exports.listar = (request, response, next) => {
    let cookies = request.get('Cookie');
    let contador;
    let mensaje;

    if (typeof cookies === 'string'){
        if (cookies.includes('consultas')){
            contador = Number.parseInt(cookies.split(';')[1].trim().split('=')[1]);
            mensaje =  cookies.split(';')[0].split('=')[1];
        }
    }
    else {
        contador = 0;
        mensaje =  '';
        request.session.email = '';
    }

    response.render('Messages', {
        array: Mensaje.fetchAll(),
        ultimo_mensaje: mensaje,
        views: contador,
        email: request.session.email,
    });
}


