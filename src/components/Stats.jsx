import { calcLevel, calculateAccuracy, calculateNewWords } from "../utils"
import ProgressBar from "./ProgressBar"

export default function Stats(props) {

  const {name, day, attempts, PLAN} = props

  const currLvl = calcLevel(day)
  const flooredLvl=Math.floor(currLvl)
  const remainder= (currLvl - flooredLvl) *100

  // Format the welcome message to include "Welcome, " prefix
  const welcomeMessage = name ? `Welcome, ${name}` : 'Welcome'

  return (
    <div className="card stats-card">
      <div className="welcome-text">
        <h4 className="text-large">{welcomeMessage}</h4>
      </div>
      <div className="stats-column">
        <div>
          <p>Streak</p>
          <h4>{day - 1}</h4>
        </div>
        <div>
          <p>Words Seem</p>
          <h4>{calculateNewWords(day-1)}</h4>
        </div>
        <div>
          <p>Accuracy</p>
          <h4>{(calculateAccuracy(attempts,day) * 100).toFixed(1)}</h4>
        </div>

      </div>

      <ProgressBar text={`lvl ${flooredLvl}`} remainder={remainder} />

    </div>
  )
}