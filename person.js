import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export function drawPerson(svg, x, y, student_num) {
    // Vibrant colors for shirts that work in both modes
    const colors = {
        1: '#FF4B4B',  // bright red
        2: '#4CAF50',  // material green
        3: '#2196F3',  // material blue
        4: '#FFC107',  // material amber
        5: '#9C27B0',  // material purple
        6: '#00BCD4',  // material cyan
        7: '#E91E63',  // material pink
        8: '#607D8B',  // material blue grey
        9: '#FF9800',  // material orange
        10: '#8BC34A'  // material light green
    };

    const skinTones = {
        1: '#FAD7B5', // light
        2: '#F1C27D', // light-medium
        3: '#E0AC69', // medium
        4: '#C68642', // medium-dark
        5: '#8D5524', // dark
        6: '#FFDBAC', // very light
        7: '#D2A679', // light-medium
        8: '#A1665E', // medium-dark
        9: '#6A4E42', // dark
        10: '#3B3024' // very dark
    };

    const hairColors = {
        1: '#000000', // black
        2: '#A52A2A', // brown
        3: '#FFD700', // blonde
        4: '#FF0000', // red
        5: '#808080', // gray
        6: '#FFFFFF', // white
        7: '#A52A2A', // auburn
        8: '#D2691E', // chestnut
        9: '#654321', // dark brown
        10: '#D2B48C' // light brown
    };

    const color = colors[student_num] || '#FF4B4B';
    const skin_color = skinTones[student_num] || 'tan';
    const hair_color = hairColors[student_num] || 'black';
    const jeans_color = '#1a237e';  // Dark blue jeans color

    y = y - 100;

    // Create a group for the person if it doesn't exist
    let personGroup = svg.selectAll(".person-group").data([student_num]);
    personGroup = personGroup.enter()
        .append("g")
        .classed("person-group", true)
        .merge(personGroup);

    // Head
    let head = personGroup.selectAll(".head").data([null]);
    head.enter()
        .append("circle")
        .classed("head", true)
        .attr("r", 20)
        .attr("fill", skin_color)
        .merge(head)
        .attr("cx", x)
        .attr("cy", y);

    // Eyes
    let leftEye = personGroup.selectAll(".left-eye-white").data([null]);
    leftEye.enter()
        .append("ellipse")
        .classed("left-eye-white", true)
        .attr("rx", 4)
        .attr("ry", 2)
        .attr("fill", "white")
        .merge(leftEye)
        .attr("cx", x - 7)
        .attr("cy", y - 5);

    let rightEye = personGroup.selectAll(".right-eye-white").data([null]);
    rightEye.enter()
        .append("ellipse")
        .classed("right-eye-white", true)
        .attr("rx", 4)
        .attr("ry", 2)
        .attr("fill", "white")
        .merge(rightEye)
        .attr("cx", x + 7)
        .attr("cy", y - 5);

    let leftPupil = personGroup.selectAll(".left-eye-black").data([null]);
    leftPupil.enter()
        .append("circle")
        .classed("left-eye-black", true)
        .attr("r", 1.5)
        .attr("fill", "black")
        .merge(leftPupil)
        .attr("cx", x - 7)
        .attr("cy", y - 5);

    let rightPupil = personGroup.selectAll(".right-eye-black").data([null]);
    rightPupil.enter()
        .append("circle")
        .classed("right-eye-black", true)
        .attr("r", 1.5)
        .attr("fill", "black")
        .merge(rightPupil)
        .attr("cx", x + 7)
        .attr("cy", y - 5);

    // Draw mouth
    let mouth = personGroup.selectAll(".mouth").data([null]);
    mouth.enter()
        .append("path")
        .classed("mouth", true)
        .attr("d", `M ${x - 7} ${y + 5} Q ${x} ${y + 15}, ${x + 7} ${y + 5}`)
        .attr("stroke", "black")
        .attr("stroke-width", 2)
        .attr("fill", "none")
        .merge(mouth);

    // Draw nose
    let nose = personGroup.selectAll(".nose").data([null]);
    nose.enter()
        .append("path")
        .classed("nose", true)
        .attr("d", `M ${x} ${y} Q ${x - 2} ${y + 10}, ${x + 2} ${y + 5} Z`)
        .attr("fill", skin_color)
        .merge(nose);

    // Draw hair
    let hair = personGroup.selectAll(".hair").data([null]);
    hair.enter()
        .append("path")
        .classed("hair", true)
        .attr("d", `M ${x - 20} ${y - 10} Q ${x} ${y - 40}, ${x + 20} ${y - 10} Z`)
        .attr("fill", hair_color)
        .merge(hair);

    // Draw arms
    let leftArm = personGroup.selectAll(".left-arm").data([null]);
    leftArm.enter()
        .append("line")
        .classed("left-arm", true)
        .attr("x1", x - 10)
        .attr("y1", y + 20)
        .attr("x2", x - 20)
        .attr("y2", y + 60)
        .attr("stroke", skin_color)
        .attr("stroke-width", 2)
        .merge(leftArm);
    
    let rightArm = personGroup.selectAll(".right-arm").data([null]);
    rightArm.enter()
        .append("line")
        .classed("right-arm", true)
        .attr("x1", x + 10)
        .attr("y1", y + 20)
        .attr("x2", x + 20)
        .attr("y2", y + 60)
        .attr("stroke", skin_color)
        .attr("stroke-width", 2)
        .merge(rightArm);
    
    // Draw sleeves
    let leftSleeve = personGroup.selectAll(".left-sleeve").data([null]);
    leftSleeve.enter()
        .append("line")
        .classed("left-sleeve", true)
        .attr("x1", x - 10)
        .attr("y1", y + 20)
        .attr("x2", x - 12.5)
        .attr("y2", y + 30)
        .attr("stroke", color)
        .attr("stroke-width", 2)
        .merge(leftSleeve);
    
    let rightSleeve = personGroup.selectAll(".right-sleeve").data([null]);
    rightSleeve.enter()
        .append("line")
        .classed("right-sleeve", true)
        .attr("x1", x + 10)
        .attr("y1", y + 20)
        .attr("x2", x + 12.5)
        .attr("y2", y + 30)
        .attr("stroke", color)
        .attr("stroke-width", 2)
        .merge(rightSleeve);
        
    // Draw body
    let body = personGroup.selectAll(".body").data([null]);
    body.enter()
        .append("rect")
        .classed("body", true)
        .attr("width", 20)
        .attr("height", 50)
        .attr("fill", color)
        .merge(body)
        .attr("x", x - 10)
        .attr("y", y + 20);
    
    // Draw shorts
    let shorts = personGroup.selectAll(".shorts").data([null]);
    shorts.enter()
        .append("rect")
        .classed("shorts", true)
        .attr("x", x - 10)
        .attr("y", y + 60)
        .attr("width", 20)
        .attr("height", 10)
        .attr("fill", jeans_color)
        .merge(shorts);

    // Student number
    let number = personGroup.selectAll(".number").data([null]);
    number.enter()
        .append("text")
        .classed("number", true)
        .attr("text-anchor", "middle")
        .attr("fill", "white")
        .text(student_num)
        .merge(number)
        .attr("x", x)
        .attr("y", y + 50);

    // Draw legs
    let leftLeg = personGroup.selectAll(".left-leg").data([null]);
    leftLeg.enter()
        .append("line")
        .classed("left-leg", true)
        .attr("x1", x - 10)
        .attr("y1", y + 70)
        .attr("x2", x - 15)
        .attr("y2", y + 100)
        .attr("stroke", jeans_color)
        .attr("stroke-width", 3)
        .merge(leftLeg);

    let rightLeg = personGroup.selectAll(".right-leg").data([null]);
    rightLeg.enter()
        .append("line")
        .classed("right-leg", true)
        .attr("x1", x + 10)
        .attr("y1", y + 70)
        .attr("x2", x + 15)
        .attr("y2", y + 100)
        .attr("stroke", jeans_color)
        .attr("stroke-width", 3)
        .merge(rightLeg);

    // Draw shoes
    let leftFoot = personGroup.selectAll(".left-foot").data([null]);
    leftFoot.enter()
        .append("line")
        .classed("left-foot", true)
        .attr("x1", x - 14)
        .attr("y1", y + 95)
        .attr("x2", x - 15)
        .attr("y2", y + 100)
        .attr("stroke", color)
        .attr("stroke-width", 2)
        .merge(leftFoot);

    let rightFoot = personGroup.selectAll(".right-foot").data([null]);
    rightFoot.enter()
        .append("line")
        .classed("right-foot", true)
        .attr("x1", x + 14)
        .attr("y1", y + 95)
        .attr("x2", x + 15)
        .attr("y2", y + 100)
        .attr("stroke", color)
        .attr("stroke-width", 2)
        .merge(rightFoot);

    return personGroup;
}

// Remove example usage
// const svg = d3.select('body')...