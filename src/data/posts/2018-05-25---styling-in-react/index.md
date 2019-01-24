---
title: Down the rabbit hole of styling in React
date: 2018-04-25
published: true
tags:
  - react
  - css
  - javascript
---
React has left the question of styling mostly unanswered. Since we are basically making HTML apps for the browser, it goes without saying that CSS will have to be the technology of choice. Yet the basic premise of Cascading Style Sheets seems to othogonal to the philosophy behind React. First, the cascading nature of CSS has little bearing on the atomic React components. Secondly, inheritence is a key feature of CSS, where React is built on the opposite paradigm of composition. Finally, CSS thrives through separation of concerns, where it is decoupled from the HTML, while React advocates tightly coupled JS, HTML (and CSS?).

While this may all hold true, React does offer its own possibilities of solving the issue. The react code is run through a compiler before deployment. This process is highly configurable and typically splits out the javascript into a separate bundle. That's something that could have use for CSS as well.

# A list of solutions

There are unanswered questions and lots of personal preferences, that have resulted in various solutions with their own following. They do not cover exactly the same needs and some can even be used in parrellel. Here is a list of solutions I explored in varying degrees of depth:
+ Atomic / functional CSS
+ CSS-modules
+ Styled components
+ JSS
+ Typography.js
+ Glamorous
+ Emotion

## Atomic / functional CSS

Atomic CSS reject the semantic and cascading nature of CSS altogether. They propose a "functional" style of CSS without any side-effects and the lowest possible specificity. Notable examples are [Tachyons]() and [ACSS](). The class names typically describe a single style they apply to the element, such as `pr-2` for "padding right, scale 2". There is a substantial stylesheet that tries to cover as many use cases as possible. In a React application, you would apply the classes almost as you would apply inline styles. Without some of the drawbacks: the styles can be cached in a separate CSS file. It's a bit of an anti-solution to the problem of integrating CSS in Javascript, in that it denies that there should be any connection. There are some advantages to this approach:
+ It's viable beyond React apps, and can be used for any project, simply being a CSS file.
+ In a perfect scenario, the default CSS file covers all your needs. What's more, you can use a cached version so it really becomes a fast solution.
+ All the information is right there with the element.
+ Eliminates the need to come up with semantic class names.

Then there are some distinct drawbacks.
+ The supplied default CSS cannot have everything covered: certainly in a world with pseudo selectors, the number of conceivable styles balloons rapidly. That leaves a choice between a large CSS file or lots of edge cases.
+ This brings us to the next issue: there is no solution beyond its limits. Are we going to use traditional CSS to cover for that?
+ Elements often get a long list of classes and the readability leaves to be desired.
+ A solution is needed for consistency in the design, which will often come down to the re-use of a number of classes. This can be stored in a variable of react or your templating language. Will we make this semantic? Are we back to square one?

## CSS Modules

CSS Modules is mainly pre-occupied with solving the scoping problem, not unlike the BEM convention exists in conventional CSS. The CSS is scoped to react components, but there is also basic support for theming. The CSS is still just CSS and is imported from a separate file into your React component.

```javascript
import styles from "./style.css";
// import { className } from "./style.css";

element.innerHTML = '<div class="' + styles.className + '">';
```

# CSS in JS solutions

CSS-in-JS is at heart a very simple process. 
+ You give me styles. 
+ I hash the content. 
+ I create a CSS Rule(s) using the hash as the class name. 
+ I put those Rule(s) into a stylesheet that exists somewhere in the DOM. 

This stylesheet uses the exact set of APIs that writing some CSS styles in an inline style tag and inserting it into the DOM would do.

## JSS

With JSS you define the styles in a javscript object. The styles are made available to the `className` property of elements. The JSS library converts the javascript styles to a CSS document and auto-generates names for the classes.

```javascript
// app.js
import injectSheet from 'react-jss';

const styles = {
  container: {
    margin: '0 auto',
    width: '100%',
    '@media screen and (min-width: 360px)': {
      maxWidth: '400px',
    },
    '@media screen and (min-width: 600px)': {
      maxWidth: '600px',
    },
  },
};

const App = (props) => (
  <div className={props.sheet.classes.container}>
    <Tweet data={data} />
  </div>
);

export default injectSheet(styles)(App);
```

There is limited support for theming.

## Typography.js

The [typography.js](http://kyleamathews.github.io/typography.js/) library has a different scope than the other solutions here. It's concerned with creating a project-wide typography and not so much with styling individual components (although these may inherit the global typography). Thereby it presents a quick and unobtrusive way to uniformely style your app.

The themes are simply collections of styles in a javscript object (somewhat like JSS). This shows how to apply and modify a theme:

```
import Typography from 'typography'
import funstonTheme from 'typography-theme-funston'
funstonTheme.baseFontSize = '22px' // was 20px.

const typography = new Typography(funstonTheme)
```

Addional styling rules can be added through plugins. It's still a pretty young project but looks promising and plays well with solutions that aim more at styling individual components.


## Styled components

With styled components, you really write css-in-js. It does take a bit more of a mental step than CSS Modules.

```javascript
import React from 'react';

import styled from 'styled-components';

// Create a <Title> react component that renders an <h1> which is
// centered, palevioletred and sized at 1.5em
const Title = styled.h1`
  font-size: 1.5em;
  text-align: center;
  color: palevioletred;
`;


// Use them like any other React component – except they're styled!
<div>
  <Title>Hello World, this is my first styled component!</Title>
</div>
```
It is tightly coupled with React, and works in React Native as well.


## Glamorous and Emotion

Glamorous and Emotion have a lot in common with each other and with Styled Components. Glamorous opts for javascript objects instead of tagged template literals. Emotion actually supports both. It makes sense to offer a choice as both have their strengths: template literals can be closer to actual CSS, while javascript objects have powerful language features for manipulation.

Emotion claims a small footprint and fast performance. Somthing I have not yet put to the test. Both have good support for theming and both have a lively community. Can't wait to see if Emotion lives up to its promises.

# My thoughts

The solutions that were explorered deviate increasingly from the tradional use of CSS. Some of the strengths of CSS may be lost along the way (cascading nature), while I am not yet clear on what is gained in terms of customization, theming and composition to make up for that. The last few solutions are tightly coupled to react-style javascript frameworks, which should also be a consideration when chosing a tool.

I will make a deep dive with Emotion and Typography.js for an upcoming project and report back on my findings.
