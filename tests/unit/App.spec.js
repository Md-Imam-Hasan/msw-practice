// libraries
import * as fetchers from '@/services/fetchers'
import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/vue'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
// our test subject
import App from '../../src/App'
// MSW handlers
import handlers from '../../src/mocks/handlers'

const fetchMessageSpy = jest.spyOn(fetchers, 'fetchMessage')

const server = setupServer(...handlers)

beforeAll(() => {
  server.listen()
})

afterEach(() => {
  fetchMessageSpy.mockClear()
  server.resetHandlers()
})

afterAll(() => {
  server.close()
})

describe('App', () => {
  it('calls fetchMessage once and displays a message', async () => {
    render(App)  
    await waitFor(() => {
      expect(screen.getByText('it works :)')).toBeInTheDocument()
    })
    expect(fetchMessageSpy).toHaveBeenCalledTimes(1)
  })

  it('shows an error message on server error', async () => {
    server.use(rest.get('/message', (req, res, ctx) => {
      return res(ctx.status(500))
    }))
    render(App)
    await waitFor(() => {
      expect(screen.getByText('server error :(')).toBeInTheDocument()
    })
    expect(fetchMessageSpy).toHaveBeenCalledTimes(1)
  })
})