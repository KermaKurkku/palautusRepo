import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import { prettyDOM } from '@testing-library/dom'
import { act } from 'react-dom/test-utils'
import Blog from './Blog'

describe('<Blog />', () => {
  let component
  const addLike = jest.fn()

  beforeEach(() => {
    const blog = {
      title: 'Testing can be dull',
      author: 'test',
      url: 'test',
      user: 'abc'
    }


    component = render(
                  <Blog blog={blog} addLike={addLike} />
                )


  })

  test('renders title and author when detail is hidden', () => {
    expect(component.container).toHaveTextContent(
      'Testing can be dull, test'
    )
  })

  test('renders url and amount of likes when show button has been pressed', () => {
    const showButton  = component.getByText('show...')
    fireEvent.click(showButton)

    const newDiv = component.container.querySelector('.details')
    
    expect(newDiv).not.toHaveStyle('display: none')

  })

  test('pressing "like" button twice activates the function twice', () => {
    const showButton  = component.getByText('show...')
    fireEvent.click(showButton)

    const likeButton = component.getByText('like')
    act(() => {
      fireEvent.click(likeButton)
      fireEvent.click(likeButton)
    })

    expect(addLike.mock.calls).toHaveLength(2)

  })

})
