import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent, act } from '@testing-library/react'
import { prettyDOM } from '@testing-library/dom'
import Blog from './Blog'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {

  test('proper callback-function is called when blog is submitted', () => {
    const create = jest.fn()

    
    const component = render(
      <BlogForm createBlog={create}/>
    )

    const title = component.container.querySelector('#title')
    const author = component.container.querySelector('#author')
    const url = component.container.querySelector('#url')
    const form = component.container.querySelector('form')

    fireEvent.change(title, {
      target: {value: 'testing'}
    })
    fireEvent.change(author, {
      target: {value: 'testDude'}
    })
    fireEvent.change(url, {
      target: {value: 'abc.def'}
    })

    fireEvent.submit(form)

    expect(create.mock.calls[0][0].title).toBe('testing')
    expect(create.mock.calls[0][0].author).toBe('testDude')
    expect(create.mock.calls[0][0].url).toBe('abc.def')

  })

})