import PDFdocument, { lineTo } from 'pdfkit'
import { IBooking } from '../interface/booking.interface';

export const generatePDF = (data:any) => {
    const doc = new PDFdocument();
    const marginLeft = 50;
    const marginRight = 50;
    const initialYPosition = 50;
    const headFontSize = 16;
    const rowFontSize = 12;
    const colGap = 200;

    doc.fontSize(headFontSize).text('booking details', marginLeft, initialYPosition)

    let yposition = initialYPosition + 40;

    data.forEach((elem:any, index:any) => {
        let bookingDetails: IBooking = elem;
        if(bookingDetails){
            doc.fontSize(rowFontSize).text(`bus name : ${bookingDetails.busName}`, marginLeft, yposition)
            doc.fontSize(rowFontSize).text(`passenger : ${bookingDetails.passenger}`, marginLeft, yposition+20)
            doc.fontSize(rowFontSize).text(`seat no : ${bookingDetails.seatNo}`, marginLeft, yposition+40)
            doc.fontSize(rowFontSize).text(`date : ${bookingDetails.date}`, marginLeft, yposition+60)
            doc.fontSize(rowFontSize).text(`time : ${bookingDetails.time}`, marginLeft, yposition+80)
            yposition += 100;
        }
        else{
            doc.fontSize(rowFontSize).text(`details unavailable`, marginLeft, yposition)
            yposition += 40;
        }
    });

    doc.moveTo(marginLeft, yposition).lineTo(marginLeft+4*colGap , yposition).stroke();
    return doc;
}
