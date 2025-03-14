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
<!-- TODO -->

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

<p align='center'>**Figure1: Initial EDA Plots**</p>

We went through 