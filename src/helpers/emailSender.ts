import * as nodemailer from "nodemailer";
import * as sgTransport from 'nodemailer-sendgrid-transport'



const options = {
    auth: {
        api_user: 'asim.bilal@rsglowtech.com',
        api_key: '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'
    }
}

export const  transporter = nodemailer.createTransport(sgTransport(options));

// export const transporter = nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 587,
//     secure: false, // true for 465, false for other ports
//     auth: {
//         user: "haya.khan180180@gmail.com", // generated ethereal user
//         pass: "cobraNAGIN55", // generated ethereal password
//     },
// });