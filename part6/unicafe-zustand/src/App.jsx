import { useFeedbackStore } from './store'

const Button = ({ children, onClick }) => (
  <button type="button" onClick={onClick}>
    {children}
  </button>
)

const StatisticLine = ({ text, value }) => (
  <tr>
    <td>{text}</td>
    <td>{value}</td>
  </tr>
)

const Statistics = () => {
  const good = useFeedbackStore((state) => state.good)
  const neutral = useFeedbackStore((state) => state.neutral)
  const bad = useFeedbackStore((state) => state.bad)
  const all = good + neutral + bad

  if (all === 0) {
    return <p>No feedback given</p>
  }

  const average = (good - bad) / all
  const positive = (good / all) * 100

  return (
    <table>
      <tbody>
        <StatisticLine text="good" value={good} />
        <StatisticLine text="neutral" value={neutral} />
        <StatisticLine text="bad" value={bad} />
        <StatisticLine text="all" value={all} />
        <StatisticLine text="average" value={average} />
        <StatisticLine text="positive" value={`${positive} %`} />
      </tbody>
    </table>
  )
}

const App = () => {
  const actions = useFeedbackStore((state) => state.actions)

  return (
    <div>
      <h1>give feedback</h1>
      <Button onClick={actions.addGood}>good</Button>
      <Button onClick={actions.addNeutral}>neutral</Button>
      <Button onClick={actions.addBad}>bad</Button>
      <h2>statistics</h2>
      <Statistics />
    </div>
  )
}

export default App
