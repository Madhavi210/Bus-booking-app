
import * as yup from 'yup'

export const userSchemaValidate = yup.object().shape({
    userName: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string().required().matches(/(?=.*[a-z])/).matches(/(?=.*[1-9])/).min(4),
    age: yup.number().required(),
    role: yup.string().required().oneOf(['user', 'admin']).default('user'),
    address: yup.string().required(),
    mobileNo: yup.string().required().matches(/^d{10}$/),
});

export const busSchemaValidate = yup.object().shape({
    busName:  yup.string().required(),
    busNumber:  yup.string().required(),
    numberOfSeat: yup.number().required(),
    description:  yup.string().required(),
});

export const bookingSchemaValidate = yup.object().shape({
    busName:  yup.string().required(),
    passenger:  yup.string().required(),
    seatNo: yup.number().required(),
    date:  yup.date().required(),
    time:  yup.string().required(),
});



