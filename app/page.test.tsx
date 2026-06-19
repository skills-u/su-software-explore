import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Page from './page'

const ABILENE = 'Abilene Christian University'

beforeEach(() => localStorage.clear())
afterEach(() => {
  document.body.style.overflow = ''
})

async function openAbilene(user: ReturnType<typeof userEvent.setup>) {
  // Two search inputs share the query state (hero + toolbar); use the first.
  const search = screen.getAllByLabelText(/search universities/i)[0]
  await user.clear(search)
  await user.type(search, 'Abilene Christian')
  const card = await screen.findByRole('button', {
    name: new RegExp(`view details for ${ABILENE}`, 'i'),
  })
  await user.click(card)
  return card
}

describe('University detail modal', () => {
  it('opens with the correct university and shows its website link', async () => {
    const user = userEvent.setup()
    render(<Page />)
    await openAbilene(user)
    const dialog = await screen.findByRole('dialog', {
      name: new RegExp(ABILENE, 'i'),
    })
    expect(dialog).toBeInTheDocument()
    expect(within(dialog).getByText('acu.edu')).toBeInTheDocument()
    expect(
      within(dialog).getByRole('link', { name: /visit website/i }),
    ).toHaveAttribute('href', expect.stringContaining('acu.edu'))
  })

  it('closes on Escape, the backdrop, and the close button', async () => {
    const user = userEvent.setup()
    render(<Page />)

    await openAbilene(user)
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    await openAbilene(user)
    await user.click(screen.getByTestId('modal-backdrop'))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    await openAbilene(user)
    await user.click(screen.getByRole('button', { name: /^close$/i }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('locks body scroll while open and restores it on close', async () => {
    const user = userEvent.setup()
    render(<Page />)
    await openAbilene(user)
    expect(document.body.style.overflow).toBe('hidden')
    await user.keyboard('{Escape}')
    expect(document.body.style.overflow).toBe('')
  })

  it('moves focus into the dialog and returns it to the card on close', async () => {
    const user = userEvent.setup()
    render(<Page />)
    const card = await openAbilene(user)
    const dialog = screen.getByRole('dialog')
    expect(dialog.contains(document.activeElement)).toBe(true)
    await user.keyboard('{Escape}')
    expect(card).toHaveFocus()
  })
})

describe('Favorites', () => {
  it('toggles a favorite and reflects it on the card and in the modal', async () => {
    const user = userEvent.setup()
    render(<Page />)
    await user.type(
      screen.getAllByLabelText(/search universities/i)[0],
      'Abilene Christian',
    )

    const addBtn = await screen.findByRole('button', {
      name: new RegExp(`add ${ABILENE} to favorites`, 'i'),
    })
    await user.click(addBtn)

    // Card now offers "remove"
    expect(
      screen.getByRole('button', {
        name: new RegExp(`remove ${ABILENE} from favorites`, 'i'),
      }),
    ).toBeInTheDocument()

    // Open the modal; its star reflects the favorited state
    await user.click(
      screen.getByRole('button', {
        name: new RegExp(`view details for ${ABILENE}`, 'i'),
      }),
    )
    const dialog = screen.getByRole('dialog')
    expect(
      within(dialog).getByRole('button', {
        name: new RegExp(`remove ${ABILENE} from favorites`, 'i'),
      }),
    ).toBeInTheDocument()
  })

  it('filters to favorites only', async () => {
    const user = userEvent.setup()
    render(<Page />)
    const search = screen.getAllByLabelText(/search universities/i)[0]
    await user.type(search, 'Abilene Christian')
    await user.click(
      await screen.findByRole('button', {
        name: new RegExp(`add ${ABILENE} to favorites`, 'i'),
      }),
    )
    // Clear the search so the favorites filter is the only constraint
    await user.clear(search)

    await user.click(screen.getByRole('button', { name: /^favorites/i }))

    expect(
      screen.getByRole('button', {
        name: new RegExp(`view details for ${ABILENE}`, 'i'),
      }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /view details for 42 US/i }),
    ).not.toBeInTheDocument()
  })
})
