![Banner](https://github.com/rybplayer/DSC106Project3/blob/main/model/ProjectBanner.png)

# The Data Science Story: Does BPM Predict Exam Scores?

Names:
- Ryan Batubara, rbatubara (at) ucsd (dot) edu
- Isaiah Fang, ifang (at) ucsd (dot) edu
- Matt Tokunaga, m2tokunaga (at) ucsd (dot) edu

**[Link to Visual](https://rybplayer.github.io/DSC106Project3/)**

**[Link to GitHub Repository](https://github.com/rybplayer/DSC106Project3)**

**[Link to Write-Up](https://docs.google.com/document/d/11cuopjt1_Wz3cys7xN6fqMfjcT-7JBAQuw7mwZK6C8I/edit?usp=sharing)**

## Tabel of Contents
- [The Data Science Story: Does BPM Predict Exam Scores?](#the-data-science-story-does-bpm-predict-exam-scores)
    - [Table of Contents](#tabel-of-contents)
    - [Abstract](#abstract)
    - [A Remark on Design Rational](#a-remark-on-design-rational)
    - [Visuals & Techniques](#visuals--techniques)
    - [Data Transformations](#data-transformations)
    - [Ethical Considerations](#ethical-considerations)
    - [Development Process & Time Management](#development-process--time-management)
    - [A Final Note on Time Management](#a-final-note-on-time-management)

## Abstract
[Back to Table of Contents](#tabel-of-contents)

Stress is commonly linked with the process of taking exams. Indeed, one may think that being calmer or less stressed in an exam may yield better scores. However, is there data that supports this claim? One way to measure stress is using heart rate, measured in beats per minute (BPM).

Our project aims to help viewers explore the relationship between BPM with exam scores. We use a [Physionet](https://physionet.org/content/wearable-exam-stress/1.0.0/data/S1/midterm_1/) dataset containing the bpm and exam data of 10 students to accomplish this. A central goal of the visualization was to display our findings in a playful yet concise manner. Here is an interaction flowchart for our visual:

1. Viewer opens the page and reads the title, the subtitle.
2. The simple exam selection and sorting menu prompts users to try experimenting with different combinations of exams.
3. Along the way, the user observes through tooltips, animations, visual decoding, and the statistics menu that the statistical regression values vary wildly. This hopefully piques the user’s interest to continue experimenting.
4. **Confetti appears with a new menu when the user has tried all 7 combinations of data. This tells the user that there is no way to p-hack to victory, before prompting some more questions to further incite discussion.**
5. By this process, the user becomes more familiar with the data and better understands the nuance of predicting exam scores using health metrics, and the confounds that may arise from such a study.

## A Remark on Design Rational
[Back to Table of Contents](#tabel-of-contents)

From the start, we knew that we wanted to make a fun interaction to explore this student-exam-bpm dataset. We knew we wanted to focus on BPM because it is strong correlated to stress, and stress is colloquially strongly correlated to exams. Furthermore, our Exploratory Data Analysis (EDA) revealed that the relationship was not as simple as it first appears.

![Banner](https://github.com/rybplayer/DSC106Project3/blob/main/model/fig1_1.png)

![Banner](https://github.com/rybplayer/DSC106Project3/blob/main/model/fig1_2.png)

<p align='center'><b>Figure 1: Initial EDA Plots</b></p>

We went through a few ideas, and we describe some below:

![Banner](https://github.com/rybplayer/DSC106Project3/blob/main/model/fig2.png)

<p align='center'><b>Figure 2: Classroom Inital Sketch</b></p>

Some alternatives that we considered implementing into our website was an entirely different setup–a classroom setting. We initially wanted to create a classroom with sprites of students in desks for an immersed effect, but decided against it because our current implementation allows for the ‘Sort by Score’ and ‘Sort by Average BPM’ implementation to work nicely with our charts. We believed that the sorting mechanisms were an important aspect of our “story” so having students in desks would have been a difficult approach. We also considered implementing a third plot on blood, but decided to remove it as our focus was on BPM and test scores. As all data visualizations strive towards, we wanted our website to have a simple, but meaningful purpose. Eventually, we landed on this idea of a stacked bar chart after a discussion on a blackboard (see Figure 3).

![Banner](https://github.com/rybplayer/DSC106Project3/blob/main/model/fig3.png)

<p align='center'><b>Figure 3: Initial Sketch of Final Idea on Blackboard</b></p>

We really liked the sortability and simplicity of this design, so we started work on a sketch. Figure 4 shows an initial sketch, before we had functional sorting:

![Banner](https://github.com/rybplayer/DSC106Project3/blob/main/model/fig4.png)

<p align='center'><b>Figure 4: Initial Sketch on the Website</b></p>

After much iteration, we finally settled on the following final design:

![Banner](https://github.com/rybplayer/DSC106Project3/blob/main/model/fig5.png)

<p align='center'><b>Figure 5: Final Design</b></p>

## Visuals & Techniques
[Back to Table of Contents](#tabel-of-contents)

We believe the above flow chart is effectively carried out using the following techniques:

**Header:** Our main research question is bolded at the top as an initial introduction to our project. It is kept short and simple to catch the viewer’s attention.

**Subtitle:** The subtitle prompts the user to interact with the visual. Furthermore, it gives additional information about the data source and this write-up (so that the user can have a general understanding of the website). 

**Color:** We chose a distinct color palette to help our audience members differentiate between students and each exam. Colors are intentionally bright to create a welcoming and visually distinguishable feel.

**Student Sprites:** Each student is represented by the same sprite, but with different clothing colors and numbers. Their color variant is also displayed on the graph (along with their number) to help the audience make the visual connection between the two plots.

**Tooltips:** A tooltip shows up whenever a student sprite, bar, or plot is hovered. This interaction motivates the user to spend time hovering and comparing these figures. Furthermore, this adds specificity to the plot and increases the credibility that this is not a deceptive visualization. 

**Exam Selection:** We have provided selection areas for Midterm 1, Midterm 2, and Final. This is the central channel of interaction users have with our visual. These boxes change the data displayed for both the bar and scatter plot in real-time. The charts animate accordingly and help the user see what changes take place. We implemented this approach to create flexibility for the user to focus on specific aspects of the data (which assessment), and attempt to p-hack their way into a better p-value. This way, we place the viewers in the role of pseudo Data Scientists, as if they were conducting “EDA” on the data and determining if any conclusions can be made.

**Sorting:** We also added sorting options for the user to toggle. Test score and BPM are two different categories to sort, so this interaction is another method of allowing the user to focus on a specific aspect of the data. Though sorting the plot does not change the regression metrics, it helps provide an additional channel for viewers to see the relationship between exam scores and average BPM.

**Regression Statistics:** We also provided a regression statistics section for the user to visualize the changes in data as the interactions are manipulated. This creates an objective or tracker for the viewer to engage with, motivating them to see all possible combinations of exams to get the highest and lowest statistical values.

**Minimalism:** Both plots (bar and scatter) are designed to be simple, but meaningful with labeled axis and content. 

**Dark Mode:** Lastly, the light/dark mode toggle is added for a fun user experience. This has the added side benefit of increasing user comfort since it will take some time to play out all the animations and try all combinations of exams.

## Data Transformations
[Back to Table of Contents](#tabel-of-contents)

Most of our data is transformed visually, through animations, color, and other visual channels, rather than directly, as actual data transformations. That said, we have employed various data transformations to help further our data science story:

**Grouping:** The most prominent transformation was grouping and aggregation. Namely, we grouped by student and exam when taking the average BPM, IQR range, and other regression metrics. This grouping and aggregation is directly controlled by the user through the exam selection menu.

**Aggregates and Summary Statistics:** We used the mean BPM and IQR range, as well as a host of regression metrics, to further summarize the data numerically. These aggregates serve not only as the values the user is attempting to p-hack by interacting with the visual, but also acts as a channel for communicating the complex relationship between the data variables.

## Ethical Considerations
[Back to Table of Contents](#tabel-of-contents)

Exams and health are both sensitive topics, so it is important we be ethically responsible in representing our data. We decided to show this ethical consideration in three ways:

**1. Earnest visualization:** We wanted to show many of the details of the data, the raw numbers so to speak. We did this through the regression metrics, tooltips, and two plots. The hope is that viewers will realize that we have no intention of misrepresenting the data. This is important for a twofold reason: First, it respects the students who took the exams for the study, and second, it respects the viewer’s time by making sure they get a good, honest view of the data.

**2. Interaction:** In our interaction we ask the user to actively attempt to manipulate the data. Our hope is that this encourages the viewer to think critically: why do some combinations of exams perform better on some metrics than others? In doing so, we ask the viewer to ask what is an ethical conclusion from this data, especially since the lowest p-value hacked is not significant at all at the typical 0.05 level. This critical thinking encourages the viewer to be more aware of the ethical implications of studies like this and how they have the potential to educate (or misinform!) accordingly.

**3. Ask, not tell:** After the user tries all combinations of exams, they are presented less so with answers but more with questions. This helps reduce our personal bias in analyzing the data. Instead, by making the user familiar with the data through interaction and providing guiding questions, the hope is that the user becomes more familiar than ever before with the ethical considerations at play in the visual. In particular, the final question “what health metrics might be good predictors of exam success” should come with skepticism to the viewer after seeing how BPM was really not a great predictor in the case of this dataset. This helps the viewer further engage in the sensitive discussion of health data in a much more educated and well-informed manner.

## Development Process & Time Management
[Back to Table of Contents](#tabel-of-contents)

The development process of Project 3 was well thought out and consistent across the board. All three team members (Isaiah, Matt, and Ryan) worked together both in-person and virtually to discuss our visions for the project as well as the steps needed to bring it to life. For a less member-to-member description, see the section named “A Remark on Design Rationale” instead.

We started out by carefully looking through the potential datasets for something flexible and relatable that we found interesting. Landing on this specific Physionet dataset on BPM and Exam Scores, we immediately went to the drawing board to sketch out visions for our website. It was easy for us to generate a research question, but we debated about what kind of graph to prioritize. 

Thankfully, the checkpoint urged us to develop 5 different visualizations; which we used to conclude the current graph on the website. To finalize our vision, we came together in a classroom (with chalk and a blackboard) to draw how we wanted to orient the webpage and interactions. After scrapping and adding ideas, we landed on a finalized vision and dispersed tasks amongst the group members. 

Ryan and Matt would specialize in the programming of the website and it’s interactions while Isaiah would focus on the checkpoint and write-up (but everyone was encouraged and did help across the board of tasks). We would all use discord for discussions on in-the-moment bugs and website designs. Although it was a lot of back and forth, the team collectively helped execute the vision altogether.

## A Final Note on Time Management
[Back to Table of Contents](#tabel-of-contents)

We spent a rough estimate of around 20 man-hours total brainstorming, vision-boarding, and programming our application. The majority of the time was spent on programming: trying to get the data to act properly, using the tools from the course to create an audience-friendly website, and debugging. 

The back and forth of ideas were a driving force in programming our website to life. In our attempt at programming the website, the bugs forced us to pivot our structure multiple times. Based on the final website, our unanimous time, effort, and communication was all worthwhile. We hope you have enjoyed interacting with the website as much as we have enjoyed working on it.
