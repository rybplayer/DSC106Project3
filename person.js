import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

function drawPerson(svg, x, y, student_num) {
    const colors = {
        1: 'red',
        2: 'orange',
        3: 'black',
        4: 'green',
        5: 'blue',
        6: 'indigo',
        7: 'violet',
        8: 'pink',
        9: 'brown',
        10: 'gray'
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

    const color = colors[student_num] || 'black';
    const skin_color = skinTones[student_num] || 'tan';
    const hair_color = hairColors[student_num] || 'black';

    y = y - 100;

    // Draw head
    svg.append('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', 20)
        .attr('fill', skin_color);

    // Draw eyes
    svg.append('ellipse')
        .attr('cx', x - 7)
        .attr('cy', y - 5)
        .attr('rx', 4)
        .attr('ry', 2)
        .attr('fill', 'white');

    svg.append('ellipse')
        .attr('cx', x + 7)
        .attr('cy', y - 5)
        .attr('rx', 4)
        .attr('ry', 2)
        .attr('fill', 'white');

    svg.append('circle')
        .attr('cx', x - 7)
        .attr('cy', y - 5)
        .attr('r', 1.5)
        .attr('fill', 'black');

    svg.append('circle')
        .attr('cx', x + 7)
        .attr('cy', y - 5)
        .attr('r', 1.5)
        .attr('fill', 'black');

    // Draw mouth
    svg.append('path')
        .attr('d', `M ${x - 7} ${y + 5} Q ${x} ${y + 15}, ${x + 7} ${y + 5}`)
        .attr('stroke', 'black')
        .attr('stroke-width', 2)
        .attr('fill', 'none');

    // Draw nose
    svg.append('path')
        .attr('d', `M ${x} ${y} Q ${x - 2} ${y + 10}, ${x + 2} ${y + 5} Z`)
        .attr('fill', skin_color);

    // Draw hair
    svg.append('path')
        .attr('d', `M ${x - 20} ${y - 10} Q ${x} ${y - 40}, ${x + 20} ${y - 10} Z`)
        .attr('fill', hair_color);

    // Draw arms
    svg.append('line')
        .attr('x1', x - 10)
        .attr('y1', y + 20)
        .attr('x2', x - 20)
        .attr('y2', y + 60)
        .attr('stroke', skin_color)
        .attr('stroke-width', 2);
    
    svg.append('line')
        .attr('x1', x + 10)
        .attr('y1', y + 20)
        .attr('x2', x + 20)
        .attr('y2', y + 60)
        .attr('stroke', skin_color)
        .attr('stroke-width', 2);
    
    // Draw sleeves
    svg.append('line')
        .attr('x1', x - 10)
        .attr('y1', y + 20)
        .attr('x2', x - 12.5)
        .attr('y2', y + 30)
        .attr('stroke', color)
        .attr('stroke-width', 2);
    
    svg.append('line')
        .attr('x1', x + 10)
        .attr('y1', y + 20)
        .attr('x2', x + 12.5)
        .attr('y2', y + 30)
        .attr('stroke', color)
        .attr('stroke-width', 2);        

    // Draw body
    svg.append('rect')
        .attr('x', x - 10)
        .attr('y', y + 20)
        .attr('width', 20)
        .attr('height', 50)
        .attr('fill', color);
    
    // Draw shorts
    svg.append('rect')
        .attr('x', x - 10)
        .attr('y', y + 60)
        .attr('width', 20)
        .attr('height', 10)
        .attr('fill', 'black');    

    // Draw student number
    svg.append('text')
        .attr('x', x)
        .attr('y', y + 50)
        .attr('text-anchor', 'middle')
        .attr('fill', 'white')
        .text(student_num);

    // Draw legs
    svg.append('line')
        .attr('x1', x - 10)
        .attr('y1', y + 70)
        .attr('x2', x - 15)
        .attr('y2', y + 100)
        .attr('stroke', 'black')
        .attr('stroke-width', 2);

    svg.append('line')
        .attr('x1', x + 10)
        .attr('y1', y + 70)
        .attr('x2', x + 15)
        .attr('y2', y + 100)
        .attr('stroke', 'black')
        .attr('stroke-width', 2);

    // Draw shoes
    svg.append('line')
        .attr('x1', x - 14)
        .attr('y1', y + 95)
        .attr('x2', x - 15)
        .attr('y2', y + 100)
        .attr('stroke', color)
        .attr('stroke-width', 2);

    svg.append('line')
        .attr('x1', x + 14)
        .attr('y1', y + 95)
        .attr('x2', x + 15)
        .attr('y2', y + 100)
        .attr('stroke', color)
        .attr('stroke-width', 2);   
}

// Example usage
const svg = d3.select('body').append('svg')
    .attr('width', 600)
    .attr('height', 500);

for (let i = 1; i <= 10; i++) {
    drawPerson(svg, 50 * i, 200, i);
}