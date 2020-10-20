import React from 'react';

const Header = ({ name }) => {
    return (
        <>
            <h2>{name}</h2>
        </>
    )
}

const Part = (props) => {
    return (
        <>
            <p>{props.part} {props.ex}</p>
        </>
    )
}

const Content = ({ course }) => {
    return (
        <>
            {course.parts.map(part =>
                <Part key={part.id} part={part.name} ex={part.exercises}  />
            )}
        </>
    )
}

const Total = ({ course }) => {
    
    const total = +course.parts.reduce( (s, p)  => {
        if (s.id === 1)
        {
            return s.exercises + p.exercises
        } else {
            return s + p.exercises
        }
        })
    return (
        <>
            <p><b>Total of {total} excercises</b></p>
        </>
    )
}

const Course = ({ course }) => {
    return (
        <>
            <Header name={course.name} />
            <Content course={course} />
            <Total course={course} />
        </>
    )
}

export default Course