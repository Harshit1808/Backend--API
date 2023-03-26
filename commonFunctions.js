const bcrypt = require('bcryptjs');
const pdf = require('html-pdf');

const encryptString = (str) => {
    return bcrypt.hashSync(str, 8);
}
function numberToEnglish(n) {

    var string = n.toString(), units, tens, scales, start, end, chunks, chunksLen, chunk, ints, i, word, words, and = 'and';

    /* Remove spaces and commas */
    string = string.replace(/[, ]/g, "");

    /* Is number zero? */
    if (parseInt(string) === 0) {
        return 'zero';
    }

    /* Array of units as words */
    units = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];

    /* Array of tens as words */
    tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

    /* Array of scales as words */
    scales = ['', 'thousand', 'million', 'billion', 'trillion', 'quadrillion', 'quintillion', 'sextillion', 'septillion', 'octillion', 'nonillion', 'decillion', 'undecillion', 'duodecillion', 'tredecillion', 'quatttuor-decillion', 'quindecillion', 'sexdecillion', 'septen-decillion', 'octodecillion', 'novemdecillion', 'vigintillion', 'centillion'];

    /* Split user argument into 3 digit chunks from right to left */
    start = string.length;
    chunks = [];
    while (start > 0) {
        end = start;
        chunks.push(string.slice((start = Math.max(0, start - 3)), end));
    }

    /* Check if function has enough scale words to be able to stringify the user argument */
    chunksLen = chunks.length;
    if (chunksLen > scales.length) {
        return '';
    }

    /* Stringify each integer in each chunk */
    words = [];
    for (i = 0; i < chunksLen; i++) {

        chunk = parseInt(chunks[i]);

        if (chunk) {

            /* Split chunk into array of individual integers */
            ints = chunks[i].split('').reverse().map(parseFloat);

            /* If tens integer is 1, i.e. 10, then add 10 to units integer */
            if (ints[1] === 1) {
                ints[0] += 10;
            }

            /* Add scale word if chunk is not zero and array item exists */
            if ((word = scales[i])) {
                words.push(word);
            }

            /* Add unit word if array item exists */
            if ((word = units[ints[0]])) {
                words.push(word);
            }

            /* Add tens word if array item exists */
            if ((word = tens[ints[1]])) {
                words.push(word);
            }

            /* Add 'and' string after units or tens integer if: */
            if (ints[0] || ints[1]) {

                /* Chunk has a hundreds integer or chunk is the first of multiple chunks */
                if (ints[2] || !i && chunksLen) {
                    words.push(and);
                }

            }

            /* Add hundreds word if array item exists */
            if ((word = units[ints[2]])) {
                words.push(word + ' hundred');
            }

        }

    }

    return words.reverse().join(' ');

}


// - - - - - Tests - - - - - -
// function test(v) {
// var sep = ('string'==typeof v)?'"':'';
// console.log("numberToEnglish("+sep + v.toString() + sep+") = "+numberToEnglish(v));
// }

// const pdfGenerate = (itemName,quantity,salePrice,totalGst,finalAmount,myName,address,myMobile,toPartyName,
//   toMobile,qtySum,taxSum,finalSum,priceSum,receivedAmount,dueAmount) => {
// const pdfGenerate = (html) => {
//   let dynamicData = '';
//   dynamicData += ` <tr>
//   <td align="left" width="75%" style="padding: 6px 12px;font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">${itemName}</td>
//   <td align="right" width="75%" style="padding: 6px 12px;font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">${quantity}</td>
//   <td align="left" width="25%" style="padding: 6px 12px;font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">${salePrice}</td>
//   <td align="left" width="75%" style="padding: 6px 12px;font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">${totalGst}</td>
//   <td align="left" width="25%" style="padding: 6px 12px;font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">${finalAmount}</td>
//   </tr>`

//   html = `<!DOCTYPE html>
//   <html lang="en">

//   <head>
//       <meta charset="UTF-8">
//       <meta http-equiv="X-UA-Compatible" content="IE=edge">
//       <meta name="viewport" content="width=device-width, initial-scale=1.0">
//       <policy domain="coder" rights="read|write" pattern="PDF" />
//       <title>Invoice</title>
//       <link
//           href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap"
//           rel="stylesheet">
//       <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet">
//       <style>
//           body {
//               font-family: Roboto;
//               font-size: 14px;
//           }

//           @media print {
//               .color {
//                   color: #5b9bd4;
//                   -webkit-print-color-adjust: exact;
//               }

//               .background-color {
//                   background-color: #f4f4f4;
//                   -webkit-print-color-adjust: exact;
//               }
//           }
//       </style>
//   </head>

//   <body>
//       <section>
//           <table style="width:100%;padding: 20px;">
//               <tr>
//                   <td class="color" style="    width: 100%; color: #0492cd; font-size: 25px; font-weight: 600;">
//                       <span>${myName}</span>
//                   </td>
//               </tr>
//               <tr>
//                   <td style="width:100%;">
//                       ${address}
//                   </td>
//               </tr>
//               <tr>
//                   <td style="width:100%;">
//                       <strong>Mobile No : </strong> ${myMobile}
//                   </td>
//               </tr>
//               <tr>
//                   <td style="width:100%;">
//                       <strong>Date  : </strong> 29 July 2022
//                   </td>
//               </tr>
//               <tr>
//                   <td style="width: 100%;">
//                       <table style="width: 100%;   margin: 10px 0; border-collapse: collapse">
//                           <tr>
//                               <th class="background-color color"
//                                   style=" background-color: #f4f4f4;text-align: left;font-weight: 400;color: #000;padding: 10px;border-top: 3px solid #0492d7;">
//                                   Consultation Details
//                               </th>
//                               <th class="background-color color"
//                                   style="     text-align:center;background-color: #f4f4f4;font-weight: 400;color: #000;padding: 10px;border-top: 3px solid #0492d7;"">
//                                   Consultation Details
//                               </th>
//                               <th class=" background-color color"
//                                   style="text-align: right; background-color: #f4f4f4;font-weight: 400;color: #000;padding: 10px;border-top: 3px solid #0492d7;"">
//                                   Consultation Details
//                               </th>

//                           </tr>



//                       </table>
//                   </td>
//               </tr>
//               <tr>
//                   <td style=" width: 100%;font-weight: 500; font-size: 16px;">
//                                   BILL TO
//                   </td>
//               </tr>
//               <tr>
//                   <td style="width:100%;">
//                       ${toPartyName}
//                   </td>
//               </tr>
//               <tr>
//                   <td style="width:100%;">
//                       Mobile No : ${toMobile}
//                   </td>
//               </tr>
//               <tr>
//                   <td style="width: 100%;">
//                       <table style="width: 100%;   margin: 10px 0; border-collapse: collapse">
//                           <tr>
//                               <th class="background-color color"
//                                   style=" background-color: #f4f4f4;text-align: left;font-weight: 400;color: #000;padding: 10px;border-top: 3px solid #0492d7;border-bottom: 2px solid #f4f4f4;">
//                                   ITERMS
//                               </th>
//                               <th class="background-color color"
//                                   style="text-align:right;background-color: #f4f4f4;font-weight: 400;color: #000;padding: 10px;border-top: 3px solid #0492d7;border-bottom: 2px solid #f4f4f4;">
//                                   QTY.
//                               </th>
//                               <th class=" background-color color"
//                                   style="text-align: right; background-color: #f4f4f4;font-weight: 400;color: #000;padding: 10px;border-top: 3px solid #0492d7;border-bottom: 2px solid #f4f4f4;">
//                                   RATE
//                               </th>
//                               <th class=" background-color color"
//                                   style="text-align: right; background-color: #f4f4f4;font-weight: 400;color: #000;padding: 10px;border-top: 3px solid #0492d7;border-bottom: 2px solid #f4f4f4;">
//                                   TAX
//                               </th>
//                               <th class=" background-color color"
//                                   style="text-align: right; background-color: #f4f4f4;font-weight: 400;color: #000;padding: 10px;border-top: 3px solid #0492d7;border-bottom: 2px solid #f4f4f4;">
//                                   AMOUNT
//                               </th>

//                           </tr>
//                           ${dynamicData}
//                           <tr>
//                               <th class=" color"
//                                   style="    font-weight: 600; text-align: left;color: #000;padding: 10px;border-bottom: 3px solid #0492d7;border-top: 3px solid #f4f4f4;">
//                                   SUB TOTAL
//                               </th>
//                               <th class=" color"
//                                   style="text-align: right;color: #000;padding: 10px;border-bottom: 3px solid #0492d7;border-top: 3px solid #f4f4f4;">
//                                   ${qtySum}
//                               </th>
//                               <th class="  color"
//                                   style="text-align: left; color: #000;padding: 10px;border-bottom: 3px solid #0492d7;border-top: 3px solid #f4f4f4;">
//                                   ${priceSum}
//                               </th>
//                               <th class="  color"
//                                   style="    font-weight: 600; text-align: left; color: #000;padding: 10px;border-bottom: 3px solid #0492d7;border-top: 3px solid #f4f4f4;">
//                                   ${taxSum}
//                               </th>
//                               <th class="  color"
//                                   style="    font-weight: 600; text-align: left; color: #000;padding: 10px;border-bottom: 3px solid #0492d7;border-top: 3px solid #f4f4f4;">
//                                   ${finalSum}
//                               </th>

//                           </tr>

//                       </table>
//                   </td>
//               </tr>
//               <tr>
//                   <td style="width: 100%;">
//                       <table style="width: 100%;   margin: 10px 0; border-collapse: collapse">
//                           <tr>
//                               <td>
//                                   <table style="width: 100%;   margin: 10px 0; border-collapse: collapse">
//                                       <tr>
//                                           <td style="    font-size: 16px; color: #000; font-weight: 500; padding-bottom: 10px;">TERMS AND CONDITIONS</td>
//                                       </tr>
//                                       <tr>
//                                           <td style="    font-size: 14px; color: #000; font-weight: 400; padding-bottom: 5px;">1. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</td>
//                                       </tr>
//                                       <tr>
//                                           <td style="    font-size: 14px; color: #000; font-weight: 400; padding-bottom: 5px;">2. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</td>
//                                       </tr>
//                                   </table>
//                               </td>
//                               <td>
//                                   <table style="width: 100%;   margin: 10px 0; border-collapse: collapse">
//                                       <tr>
//                                           <td style="    font-size: 14px; color: #000; font-weight: 400; padding-bottom: 10px;text-align: right;">TAXABLE AMOUNT</td>
//                                           <td style="    font-size: 14px; color: #000; font-weight: 400; padding-bottom: 10px;text-align: right;">  <i class="fa fa-inr" aria-hidden="true"></i> ${priceSum}</td>
//                                       </tr>
//                                       <tr>
//                                           <td style="    font-size: 14px; color: #000; font-weight: 400; padding-bottom: 10px;text-align: right;">Gst</td>
//                                           <td style="    font-size: 14px; color: #000; font-weight: 400; padding-bottom: 10px;text-align: right;">  <i class="fa fa-inr" aria-hidden="true"></i> ${taxSum}</td>
//                                       </tr>
//                                       <tr>
//                                           <td style="    font-size: 14px; color: #000; font-weight: 500; padding: 10px 0;text-align: right;border-bottom:1px solid #c4bebe">TOTAL</td>
//                                            <td style="    font-size: 14px; color: #000; font-weight: 500; padding: 10px 0;text-align: right;border-bottom:1px solid #c4bebe">  <i class="fa fa-inr" aria-hidden="true"></i> ${finalSum}</td>
//                                       </tr>
//                                       <tr>
//                                           <td style="    font-size: 14px; color: #000; font-weight: 400; padding: 10px 0;text-align: right;border-bottom:1px solid #c4bebe">Received Amount</td>
//                                            <td style="    font-size: 14px; color: #000; font-weight: 400; padding: 10px 0;text-align: right;border-bottom:1px solid #c4bebe">  <i class="fa fa-inr" aria-hidden="true"></i>${receivedAmount}</td>
//                                       </tr>
//                                       <tr>
//                                           <td style="    font-size: 14px; color: #000; font-weight: 500; padding: 10px 0;text-align: right;border-bottom:1px solid #c4bebe">Balance</td>
//                                            <td style="    font-size: 14px; color: #000; font-weight: 500; padding: 10px 0;text-align: right;border-bottom:1px solid #c4bebe">  <i class="fa fa-inr" aria-hidden="true"></i> ${dueAmount}</td>
//                                       </tr>
//                                   </table>
//                               </td>
//                           </tr>

//                       </table>
//                   </td>
//               </tr>


//           </table>


//       </section>
//   </body>

//   </html>`
// //   pdf.create(html).toFile('path',function(err,result){

// //   })
// }

module.exports = {
    encryptString: encryptString,
    numberToEnglish: numberToEnglish
    // pdfGenerate: pdfGenerate

}