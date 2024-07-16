// export const drawDetections = (detections, ctx) =>{
//     detections.forEach(prediction=>{
//         // Get prediction results
//         const [x,y,width,height] = prediction['bbox'];
//         const text = prediction['class'];

//         // Set styling
//         const color = 'green'
//         ctx.strokeSylt = color
//         ctx.font = '18px Arial'
//         ctx.fillStyle = color

//         // Draw rectangles and text
//         ctx.beginPath()
//         ctx.fillText(text, x, y)
//         ctx.rect(x, y, width, height)
//         ctx.stroke()
//     })
// }

export const processPredictions = (ctx, detections) =>{

    let filteredBoxes = []

    detections.forEach(prediction=>{
        // Get prediction results
        const [x,y,width,height] = prediction['bbox'];
        if (prediction['class'] == 'person'){
            filteredBoxes.push([x,y,width,height])
            // Display boxes
            const color = 'blue';
            ctx.strokeStyle = color; 
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.rect(x, y, width, height);
            ctx.stroke();
            }
    })

    return filteredBoxes
}
