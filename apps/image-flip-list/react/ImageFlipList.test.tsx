import React from 'react'
import { render } from '@vtex/test-tools/react'

import ImageFlipList from './ImageFlipList'

test('greets Fred', () => {
  const { queryByText } = render(<ImageFlipList name="Fred" />)

  expect(queryByText('Hey, Fred')).toBeInTheDocument()
})
