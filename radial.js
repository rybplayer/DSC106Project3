// First, add import for drawPerson
import { drawPerson } from './person.js';

// Set up dimensions
const margin1 = { top: 120, right: 60, bottom: 60, left: 60 };  // For stacked bar
const width = 800 - margin1.left - margin1.right;
const height = 400 - margin1.top - margin1.bottom;

// Different margins for each plot
const margin2 = { top: 20, right: 60, bottom: 60, left: 60 };   // For scatter plot

// Create tooltip div
const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)
    .style("position", "absolute")
    .style("background-color", "white")
    .style("border", "1px solid #ddd")
    .style("border-radius", "4px")
    .style("padding", "8px")
    .style("pointer-events", "none");

// Define global color constants
const EXAM_COLORS = {
    "Final": "#1f77b4",      // Blue
    "Midterm 1": "#ff7f0e",  // Orange
    "Midterm 2": "#2ca02c"   // Green
};

// Replace the old colors array
const colors = [EXAM_COLORS["Midterm 1"], EXAM_COLORS["Midterm 2"], EXAM_COLORS["Final"]];

// Update the plot container structure
const plotContainer = d3.select("#plot");

// Create separate containers for each plot and controls
const visualizationContainer = plotContainer.append("div")
    .attr("class", "visualization-container");

const stackedContainer = visualizationContainer.append("div")
    .attr("class", "stacked-container");

const scatterContainer = visualizationContainer.append("div")
    .attr("class", "scatter-container");

// Create controls container
const controlsContainer = plotContainer.append("div")
    .attr("class", "controls-container");

// Create SVGs in their containers
const stackedSvg = stackedContainer
    .append("svg")
    .attr("width", width + margin1.left + margin1.right)
    .attr("height", height + margin1.top + margin1.bottom)
    .append("g")
    .attr("transform", `translate(${margin1.left},${margin1.top})`);

const scatterSvg = scatterContainer
    .append("svg")
    .attr("width", width + margin2.left + margin2.right)
    .attr("height", height + margin2.top + margin2.bottom)
    .append("g")
    .attr("transform", `translate(${margin2.left},${margin2.top})`);

// Create checkbox container with label
const checkboxContainer = controlsContainer.append("div")
    .attr("class", "control-group");

checkboxContainer.append("div")
    .attr("class", "control-label")
    .text("Exam selection");

const checkboxDiv = checkboxContainer
    .append("div")
    .attr("class", "checkbox-container");

// Create sorting container with label
const sortingContainer = controlsContainer.append("div")
    .attr("class", "control-group");

sortingContainer.append("div")
    .attr("class", "control-label")
    .text("Sort options (decreasing order)");

const sortingDiv = sortingContainer
    .append("div")
    .attr("class", "sorting-container");

// Update sort options and add them to sortingDiv
const sortOptions = ["Sort by Score", "Sort by Average BPM"];
sortingDiv.selectAll("div")
    .data(sortOptions)
    .enter()
    .append("div")
    .each(function(d, i) {
        const container = d3.select(this);
        container.append("input")
            .attr("type", "radio")
            .attr("id", d.replace(/\s+/g, ''))
            .attr("name", "sorting")
            .attr("value", d)
            .attr("checked", i === 0 ? true : null)
            .on("change", function() {
                updateSorting(this.value);
            });
        
        container.append("label")
            .attr("for", d.replace(/\s+/g, ''))
            .text(d);
    });

// Add checkboxes
const exams = ["Midterm 1", "Midterm 2", "Final"];
let selectedExams = new Set(exams);
let processedData = null;

console.log("Initial selectedExams:", selectedExams);

// Replace dark mode toggle with modern switch
const darkModeToggle = d3.select("body")
    .append("div")
    .attr("class", "dark-mode-toggle")
    .style("position", "absolute")
    .style("top", "20px")
    .style("right", "20px");

darkModeToggle.html(`
    <label class="switch">
        <input type="checkbox">
        <span class="slider">
            <span class="moon">🌙</span>
            <span class="sun">☀️</span>
        </span>
    </label>
`);

darkModeToggle.select("input")
    .on("change", toggleDarkMode);

// Add dark mode state
let isDarkMode = false;

function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    
    // Update body background and text color
    d3.select("body")
        .classed("dark-mode", isDarkMode)
        .style("background-color", isDarkMode ? "#1a1a1a" : "white")
        .style("color", isDarkMode ? "white" : "black");
    
    // Update all text elements including slope
    d3.selectAll(".axis text, .axis-label, .slope-tooltip")
        .style("fill", isDarkMode ? "white" : "black");
    
    // Update axes
    d3.selectAll(".axis path, .axis line")
        .style("stroke", isDarkMode ? "white" : "black");
    
    // Update plot background
    d3.selectAll("svg")
        .style("background-color", isDarkMode ? "#1a1a1a" : "white");
        
    // Update UI elements
    d3.select(".checkbox-container")
        .style("background-color", isDarkMode ? "#2d2d2d" : "white")
        .style("border-color", isDarkMode ? "#404040" : "#ddd");
        
    d3.select(".sorting-container")
        .style("background-color", isDarkMode ? "#2d2d2d" : "white")
        .style("border-color", isDarkMode ? "#404040" : "#ddd");

    // Update scatter plot labels
    scatterSvg.selectAll("text")
        .style("fill", isDarkMode ? "white" : "black");
}

// Add near top with other global variables
let seenCombinations = new Set();
const allPossibleCombinations = 7; // 1,2,3,12,13,23,123

// Add this function to check combinations
function checkExamCombination() {
    const currentCombo = Array.from(selectedExams).sort().join('');
    seenCombinations.add(currentCombo);
    
    if (seenCombinations.size === allPossibleCombinations && !document.querySelector('.completion-message')) {
        // Trigger confetti
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min, max) => Math.random() * (max - min) + min;

        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti(Object.assign({}, defaults, {
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
            }));
            confetti(Object.assign({}, defaults, {
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
            }));
        }, 250);

        // Add completion message
        const completionContainer = controlsContainer.append("div")
            .attr("class", "control-group completion-message")
            .style("opacity", 0);

        completionContainer.append("div")
            .attr("class", "control-label")
            .text("You've seen all exam combinations!");

        const messageDiv = completionContainer.append("div")
            .attr("class", "completion-container");

        messageDiv.html(`
            
            <div class="reflection-questions">
                <p>It seems we didn't find any significant results. Why could this be?</p>
                <p>Key Questions:</p>
                <ul>
                    <li>Which exam combinations showed the strongest BPM-grade correlation?</li>
                    <li>The range of p-values was huge. Why could this be?</li>
                    <li>Was heart rate a good predictor of scores?</li>
                    <li>What other health factors might be better predictors of exam scores?</li>
                </ul>
            </div>
        `);

        // Fade in the message
        completionContainer.transition()
            .duration(1000)
            .style("opacity", 1);
    }
}

function updateVisualizations() {
    if (!processedData) return;
    
    // Stop any ongoing transitions
    scatterSvg.selectAll("*").interrupt();
    stackedSvg.selectAll("*").interrupt();
    
    console.log("Updating visualizations with exams:", selectedExams);
    // Filter data based on selected exams
    const filteredScores = processedData.scoreData.filter(d => selectedExams.has(d.Exam));
    console.log("Filtered scores:", filteredScores);

    // Calculate sum of scores per student
    const studentTotals = d3.rollup(filteredScores,
        v => ({
            total: d3.sum(v, d => d.Score),
            scores: Object.fromEntries(v.map(d => [d.Exam, d.Score]))
        }),
        d => d.Student
    );

    // Sort students by total score
    const sortedStudents = Array.from(studentTotals.entries())
        .sort((a, b) => b[1].total - a[1].total)
        .map(d => d[0]);

    // Update both visualizations
    updateStackedBarChart(studentTotals, sortedStudents);
    updateScatterPlot(studentTotals, processedData.bpmDataGrouped);
    
    checkExamCombination();
}

checkboxDiv.selectAll("div")
    .data(exams)
    .enter()
    .append("div")
    .each(function(d, i) {
        const container = d3.select(this);
        container.append("input")
            .attr("type", "checkbox")
            .attr("id", d.replace(" ", ""))
            .attr("checked", true)
            .on("change", function() {
                const exam = d3.select(this.parentNode).datum();
                if (this.checked) {
                    selectedExams.add(exam);
                } else {
                    selectedExams.delete(exam);
                }
                console.log("Checkbox changed:", exam);
                console.log("Is checked:", this.checked);
                console.log("Current selectedExams:", selectedExams);
                updateVisualizations();
            });
        
        container.append("label")
            .attr("for", d.replace(" ", ""))
            .text(d)
            .style("color", colors[i]);
    });

// Load and process data
Promise.all([
    d3.csv("data/csv/size_bpm.csv"),
    d3.csv("data/csv/bpm.csv")
]).then(([sizeData, bpmData]) => {
    processedData = processData(sizeData, bpmData);
    console.log(processedData);
    updateVisualizations();
}).catch(error => console.error("Error loading data:", error));

function processData(sizeData, bpmData) {
    // Group BPM data by Student and Exam to store all BPM values
    const bpmDataGrouped = d3.rollup(bpmData,
        v => v.map(d => +d.BPM),  // Store all BPM values as an array
        d => d.Student,
        d => d.Exam
    );

    // Process score data
    const scoreData = sizeData.map(d => ({
        Student: d.Student,
        Exam: d.Exam,
        Score: +d.Score
    }));

    return { bpmDataGrouped, scoreData };
}

function updateStackedBarChart(studentTotals, sortedStudents) {
    if (selectedExams.size === 0) {
        // Fade out bars, people, and hitboxes
        stackedSvg.selectAll(".student-group, .person-group, .person-hitbox")
            .transition()
            .duration(1000)
            .style("opacity", 0)
            .remove();  // Remove elements after fade
            
        return;
    }
    
    // Reset opacity for all elements
    stackedSvg.selectAll(".student-group, .person-group")
        .style("opacity", 1);

    // Set up scales
    const xScale = d3.scaleBand()
        .domain(sortedStudents)
        .range([0, width])
        .padding(0.1);

    const yScale = d3.scaleLinear()
        .domain([0, 300])  // Fixed domain from 0 to 300
        .range([height, 0]);

    // Initial positions for students (1-10 order)
    const initialPositions = {};
    sortedStudents.forEach((student, i) => {
        const studentNum = parseInt(student.replace('S', ''));
        initialPositions[student] = (studentNum - 1) * (width / 10);
    });

    // Update bars
    const studentGroups = stackedSvg.selectAll(".student-group")
        .data(sortedStudents, d => d);

    // Exit old bars
    studentGroups.exit()
        .transition()
        .duration(1000)
        .attr("transform", d => `translate(${xScale(d)},0)`)
        .remove();

    // Enter new bars
    const studentGroupsEnter = studentGroups.enter()
        .append("g")
        .attr("class", "student-group")
        .attr("transform", d => `translate(${initialPositions[d] || 0},0)`);

    // Update all groups
    const allGroups = studentGroupsEnter.merge(studentGroups);

    // Function to update bars within a group
    function updateBars(selection) {
        selection.each(function(student) {
            const group = d3.select(this);
            const studentData = studentTotals.get(student);
            let cumHeight = height;

            const bars = group.selectAll("rect")
                .data(Array.from(selectedExams));

            // Remove old bars
            bars.exit()
                .transition()
                .duration(1000)
                .attr("height", 0)
                .attr("y", height)
                .remove();

            // Add new bars
            const barsEnter = bars.enter()
                .append("rect")
                .attr("width", xScale.bandwidth())
                .attr("y", height)
                .attr("height", 0);

            // Merge and update all bars
            bars.merge(barsEnter)
                .attr("fill", d => EXAM_COLORS[d])
                .on("mouseover", function(event, d) {
                    const score = studentData.scores[d];
                    tooltip.transition()
                        .duration(200)
                        .style("opacity", .9);
                    tooltip.html(`${d}: ${score} points`)
                        .style("left", (event.pageX + 10) + "px")
                        .style("top", (event.pageY - 28) + "px");
                })
                .on("mouseout", function() {
                    tooltip.transition()
                        .duration(500)
                        .style("opacity", 0);
                })
                .transition()
                .duration(1000)
                .attr("width", xScale.bandwidth())
                .attr("y", (d, i) => {
                    const score = studentData.scores[d] || 0;
                    const barHeight = height - yScale(score);
                    cumHeight -= barHeight;
                    return cumHeight;
                })
                .attr("height", d => {
                    const score = studentData.scores[d] || 0;
                    return height - yScale(score);
                });
        });
    }

    // First transition: Move to correct x positions
    allGroups.transition()
        .duration(1000)
        .attr("transform", d => `translate(${xScale(d)},0)`);
    
    // Update the bars
    allGroups.call(updateBars);

    // Update people
    const people = stackedSvg.selectAll(".person-group")
        .data(sortedStudents, d => d);

    // Remove old people
    people.exit()
        .transition()
        .duration(1000)
        .remove();

    // Add new people at initial positions
    const peopleEnter = people.enter()
        .append("g")
        .attr("class", "person-group")
        .attr("transform", d => {
            const x = initialPositions[d] + xScale.bandwidth() / 2;
            return `translate(${x},0)`;  // Start at top (y=0)
        })
        .each(function(d) {
            const studentNum = parseInt(d.replace('S', ''));
            drawPerson(d3.select(this), 0, 0, studentNum);
        });
        

    // Update all people with transition
    const allPeople = peopleEnter.merge(people);
    
    // Remove old hitboxes first
    allPeople.selectAll(".person-hitbox").remove();
    
    // Transition to final position
    allPeople
        .transition()
        .duration(1000)
        .attr("transform", d => {
            const studentData = studentTotals.get(d);
            const x = xScale(d) + xScale.bandwidth() / 2;
            const y = selectedExams.size > 0 ? yScale(studentData.total) - 100 : height;
            return `translate(${x},${y})`;
        })
        .on("end", function(d) {
            const studentNum = parseInt(d.replace('S', ''));
            drawPerson(d3.select(this), 0, 0, studentNum);
            
            // Add new hitbox after transition
            const group = d3.select(this);
            const student = d;
            const studentBPMs = processedData.bpmDataGrouped.get(student);
            const selectedBPMs = Array.from(selectedExams)
                .map(exam => studentBPMs.get(exam))
                .filter(bpm => bpm !== undefined);
            const avgBPM = d3.mean(selectedBPMs) || 0;

            group.append("rect")
                .attr("class", "person-hitbox")
                .attr("x", -20)
                .attr("y", -40)
                .attr("width", 40)
                .attr("height", 140)
                .attr("fill", "transparent")
                .style("pointer-events", "all")
                .on("mouseover", function(event, d) {
                    const studentBPMs = processedData.bpmDataGrouped.get(d);
                    const selectedBPMs = Array.from(selectedExams)
                        .flatMap(exam => studentBPMs.get(exam) || [])
                        .filter(bpm => bpm !== undefined);
                    
                    const avgBPM = d3.mean(selectedBPMs) || 0;

                    tooltip.transition()
                        .duration(200)
                        .style("opacity", .9);
                    tooltip.html(`Average BPM: ${avgBPM.toFixed(1)}`)
                        .style("left", (event.pageX + 10) + "px")
                        .style("top", (event.pageY - 28) + "px");
                })
                .on("mouseout", function() {
                    tooltip.transition()
                        .duration(500)
                        .style("opacity", 0);
                })
                .on("mousemove", function(event) {
                    tooltip.style("left", (event.pageX + 10) + "px")
                        .style("top", (event.pageY - 28) + "px");
                });
        });

    // Update axes with larger font and labels
    stackedSvg.selectAll(".axis").remove();
    
    stackedSvg.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(xScale))
        .style("font-size", "14px")
        .append("text")
        .attr("class", "axis-label")
        .attr("x", width / 2)
        .attr("y", 40)
        .attr("fill", "currentColor")
        .style("text-anchor", "middle")
        .style("font-size", "16px")
        .text("Student");

    stackedSvg.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(yScale))
        .style("font-size", "14px")
        .append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -40)
        .attr("fill", "currentColor")
        .style("text-anchor", "middle")
        .style("font-size", "16px")
        .text("Total Score");

    // Update checkbox colors to match exams
    checkboxDiv.selectAll("label")
        .style("color", d => EXAM_COLORS[d]);
}

// Add these near the top with other global variables
let statsHistory = {
    highestR2: 0,
    lowestR2: 1,
    highestPValue: 0,
    lowestPValue: 1
};

// Add the stats container after the sorting container
const statsContainer = controlsContainer.append("div")
    .attr("class", "control-group");

statsContainer.append("div")
    .attr("class", "control-label")
    .text("Regression stats");

const statsDiv = statsContainer
    .append("div")
    .attr("class", "stats-container");

// Add the stats elements
const currentStats = statsDiv.append("div")
    .attr("class", "current-stats");
currentStats.append("div").attr("class", "stat-item slope-stat");
currentStats.append("div").attr("class", "stat-item r2-stat");
currentStats.append("div").attr("class", "stat-item p-stat");

const recordStats = statsDiv.append("div")
    .attr("class", "record-stats");
recordStats.append("div").attr("class", "stat-item r2-records");
recordStats.append("div").attr("class", "stat-item p-records");

// Update the updateScatterPlot function to include new statistics
function updateScatterPlot(studentTotals, bpmDataGrouped) {
    if (selectedExams.size === 0) {
        // Fade out only points and best fit line
        scatterSvg.selectAll(".point-group, .best-fit")
            .transition()
            .duration(1000)
            .style("opacity", 0);
        return;
    }
    
    // Reset opacity for points and best fit line
    scatterSvg.selectAll(".point-group, .best-fit")
        .style("opacity", 1);
        
    // Define xScale with a fixed domain from 0 to 300
    const xScale = d3.scaleLinear()
        .domain([0, 300])
        .range([0, width]);

    // Reuse the filtered data from the first plot
    const scatterData = Array.from(studentTotals.entries()).map(([student, scoreData]) => {
        const studentBPMs = bpmDataGrouped.get(student);
        const selectedBPMs = Array.from(selectedExams)
            .flatMap(exam => studentBPMs.get(exam) || []);  // Flatten to get all BPMs

        if (selectedBPMs.length === 0) {
            console.warn(`No BPM data for student ${student} with selected exams:`, selectedExams);
            return null; // Skip this student if no BPM data is available
        }

        const avgBPM = d3.mean(selectedBPMs);
        const minBPM = d3.min(selectedBPMs);
        const maxBPM = d3.max(selectedBPMs);
        const q1BPM = d3.quantile(selectedBPMs, 0.25);
        const q3BPM = d3.quantile(selectedBPMs, 0.75);

        return {
            student: student,
            studentNum: parseInt(student.replace('S', '')),
            avgBPM: avgBPM,
            totalScore: scoreData.total,
            bpmValues: selectedBPMs,
            minBPM: minBPM,
            maxBPM: maxBPM,
            q1BPM: q1BPM,
            q3BPM: q3BPM,
            examScores: scoreData.scores,
            examBPMs: Object.fromEntries(
                Array.from(selectedExams).map(exam => [exam, studentBPMs.get(exam)])
            )
        };
    }).filter(d => d !== null);

    // Get shirt colors from the colors object defined in person.js
    const shirtColors = {
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

    // Calculate the y-axis domain based on IQR
    const allBPMs = scatterData.flatMap(d => d.bpmValues);
    const q1Overall = d3.quantile(allBPMs, 0.25);
    const q3Overall = d3.quantile(allBPMs, 0.75);
    const iqrOverall = q3Overall - q1Overall;
    const yMin = Math.max(0, q1Overall - 1.05 * iqrOverall);
    const yMax = q3Overall + 0.5 * iqrOverall;

    const yScale = d3.scaleLinear()
        .domain([yMin, yMax])
        .range([height, 0]);

    // Update axes with larger font
    if (!scatterSvg.select(".x-axis").size()) {
        scatterSvg.append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(xScale))
            .style("font-size", "14px")  // Increased from default
            .append("text")
            .attr("class", "axis-label")
            .attr("x", width / 2)
            .attr("y", 40)
            .attr("fill", "currentColor")
            .style("text-anchor", "middle")
            .style("font-size", "16px")  // Increased from default
            .text("Total Score");

        scatterSvg.append("g")
            .attr("class", "y-axis")
            .call(d3.axisLeft(yScale))
            .style("font-size", "14px")  // Increased from default
            .append("text")
            .attr("class", "axis-label")
            .attr("transform", "rotate(-90)")
            .attr("x", -height / 2)
            .attr("y", -40)
            .attr("fill", "currentColor")
            .style("text-anchor", "middle")
            .style("font-size", "16px")  // Increased from default
            .text("Heart Rate (BPM)");
    }

    // Transition axes
    scatterSvg.select(".x-axis").transition().duration(1000).call(d3.axisBottom(xScale));
    scatterSvg.select(".y-axis").transition().duration(1000).call(d3.axisLeft(yScale));

    // Update points and IQR ranges
    const points = scatterSvg.selectAll(".point-group")
        .data(scatterData, d => d.student);

    points.exit().remove();

    // Enter new points
    const pointsEnter = points.enter()
        .append("g")
        .attr("class", "point-group")
        .attr("transform", d => `translate(${xScale(d.totalScore)},${yScale(d.avgBPM)})`);

    // Update the IQR range lines
    pointsEnter.append("line")
        .attr("class", "bpm-range")
        .attr("x1", 0)
        .attr("x2", 0)
        .attr("y1", d => yScale(d.q3BPM) - yScale(d.avgBPM))
        .attr("y2", d => yScale(d.q1BPM) - yScale(d.avgBPM))
        .style("stroke", d => shirtColors[d.studentNum])
        .style("stroke-width", 2)
        .style("opacity", 0.5);

    // Add points with updated tooltip
    pointsEnter.append("circle")
        .attr("r", 6)
        .attr("fill", d => shirtColors[d.studentNum])
        .on("mouseover", function(event, d) {
            // Calculate the total score and IQR based on selected exams
            const selectedScores = Array.from(selectedExams)
                .map(exam => d.examScores[exam])
                .filter(score => score !== undefined);
            
            const totalScore = d3.sum(selectedScores);
            
            const selectedBPMs = Array.from(selectedExams)
                .flatMap(exam => d.examBPMs[exam] || [])
                .filter(bpm => bpm !== undefined);
            
            const avgBPM = d3.mean(selectedBPMs);
            const q1BPM = d3.quantile(selectedBPMs, 0.25);
            const q3BPM = d3.quantile(selectedBPMs, 0.75);

            // Update tooltip content to show IQR
            const tooltipContent = `
                Student: ${d.student}<br>
                Total Score: ${totalScore.toFixed(1)}<br>
                Average BPM: ${avgBPM.toFixed(1)}<br>
                BPM IQR: ${q1BPM.toFixed(1)} - ${q3BPM.toFixed(1)}
            `;

            tooltip.style("opacity", 1)
                .html(tooltipContent)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 10) + "px");
        })
        .on("mouseout", function() {
            tooltip.style("opacity", 0);
        })
        .on("mousemove", function(event) {
            tooltip.style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 10) + "px");
        });

    // Update the scatter plot point labels
    pointsEnter.append("text")
        .attr("dy", -8)
        .style("text-anchor", "middle")
        .style("font-size", "12px")
        .style("fill", isDarkMode ? "white" : "black")
        .text(d => d.student);

    // Update all points and their ranges with transitions
    const allPoints = points.merge(pointsEnter);

    // Transition the groups
    allPoints.transition()
        .duration(1000)
        .attr("transform", d => `translate(${xScale(d.totalScore)},${yScale(d.avgBPM)})`);

    // Update regression statistics
    if (scatterData.length > 1) {
        const n = scatterData.length;
        const p = 1;  // one predictor
        
        const xMean = d3.mean(scatterData, d => d.totalScore);
        const yMean = d3.mean(scatterData, d => d.avgBPM);
        const ssxy = d3.sum(scatterData, d => (d.totalScore - xMean) * (d.avgBPM - yMean));
        const ssxx = d3.sum(scatterData, d => (d.totalScore - xMean) * (d.totalScore - xMean));
        const ssyy = d3.sum(scatterData, d => (d.avgBPM - yMean) * (d.avgBPM - yMean));
        
        const slope = ssxy / ssxx;
        const r2 = (ssxy * ssxy) / (ssxx * ssyy);
        
        // Calculate adjusted R²
        const adjustedR2 = 1 - ((1 - r2) * (n - 1) / (n - p - 1));
        
        // Calculate p-value
        const r = Math.sqrt(r2);
        const t = r * Math.sqrt((n-2)/(1-r*r));
        const pValue = 2 * (1 - jStat.studentt.cdf(Math.abs(t), n-2));
        
        // Update historical values
        statsHistory.highestR2 = Math.max(statsHistory.highestR2, adjustedR2);
        statsHistory.lowestR2 = Math.min(statsHistory.lowestR2, adjustedR2);
        statsHistory.highestPValue = Math.max(statsHistory.highestPValue, pValue);
        statsHistory.lowestPValue = Math.min(statsHistory.lowestPValue, pValue);
        
        // Update stats display
        currentStats.select(".slope-stat")
            .html(`Slope: ${slope.toFixed(2)} BPM/point`);
        currentStats.select(".r2-stat")
            .html(`Adjusted R²: ${adjustedR2.toFixed(3)}`);
        currentStats.select(".p-stat")
            .html(`p-value: ${pValue.toFixed(3)}`);
            
        recordStats.select(".r2-records")
            .html(`Highest Adj. R²: ${statsHistory.highestR2.toFixed(3)}<br>Lowest Adj. R²: ${statsHistory.lowestR2.toFixed(3)}`);
        recordStats.select(".p-records")
            .html(`Highest p-value: ${statsHistory.highestPValue.toFixed(3)}<br>Lowest p-value: ${statsHistory.lowestPValue.toFixed(3)}`);
        
        // Determine max x value based on number of selected exams
        const maxScore = selectedExams.size * 100;
        
        // Add line of best fit with dynamic domain
        const lineData = [
            { x: 0, y: yMean - slope * xMean },
            { x: maxScore, y: yMean + slope * (maxScore - xMean) }
        ];

        // Update or create the best fit line
        const bestFitLine = scatterSvg.selectAll(".best-fit")
            .data([lineData]);

        bestFitLine.enter()
            .append("line")
            .attr("class", "best-fit")
            .merge(bestFitLine)
            .style("stroke", "red")
            .style("stroke-width", 2)
            .style("stroke-dasharray", "4,4")
            .transition()
            .duration(1000)
            .attr("x1", d => xScale(d[0].x))
            .attr("y1", d => yScale(d[0].y))
            .attr("x2", d => xScale(d[1].x))
            .attr("y2", d => yScale(d[1].y));

        bestFitLine.exit().remove();

        const cohensD = (2 * r) / Math.sqrt(1 - r * r);
        // Values > 0.8 are considered "large effects"
    }

    // Remove the old slope tooltip
    scatterSvg.selectAll(".slope-tooltip").remove();
}

// Add sorting function
function updateSorting(sortType) {
    if (!processedData) return;
    
    const filteredScores = processedData.scoreData.filter(d => selectedExams.has(d.Exam));
    
    // Calculate student totals
    const studentTotals = d3.rollup(filteredScores,
        v => ({
            total: d3.sum(v, d => d.Score),
            scores: Object.fromEntries(v.map(d => [d.Exam, d.Score]))
        }),
        d => d.Student
    );

    // Sort students based on selected option
    let sortedStudents;
    if (sortType === "Sort by Score") {
        sortedStudents = Array.from(studentTotals.entries())
            .sort((a, b) => b[1].total - a[1].total)
            .map(d => d[0]);
    } else {
        // For BPM sorting, use the bpmDataGrouped from processedData
        sortedStudents = Array.from(studentTotals.entries())
            .sort((a, b) => {
                const bpmA = d3.mean(Array.from(processedData.bpmDataGrouped.get(a[0]).values())) || 0;
                const bpmB = d3.mean(Array.from(processedData.bpmDataGrouped.get(b[0]).values())) || 0;
                return bpmB - bpmA;
            })
            .map(d => d[0]);
    }

    // Update visualizations with new sorting
    updateStackedBarChart(studentTotals, sortedStudents);
    updateScatterPlot(studentTotals, processedData.bpmDataGrouped);
}