import React from "react";
import "./styles.css";
import Dice from "./Dice";
import { nanoid } from "nanoid";
import useWindowSize from "react-use/lib/useWindowSize";
import Confetti from "react-confetti";

export default function App() {
  const [DiceArray, setDiceArray] = React.useState(generateDiceArray());

  const [Tenzies, setTenzies] = React.useState(false);
  React.useEffect(() => {
    const allHeld = DiceArray.every((die) => die.isHeld === true);
    const firstValue = DiceArray[0].value;
    const allSameValue = DiceArray.every((die) => die.value === firstValue);
    if (allHeld && allSameValue) {
      setTenzies(!Tenzies);
    }
  }, [DiceArray]);

  function generateDie() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid()
    };
  }

  function generateDiceArray() {
    const newDice = [];
    for (let i = 0; i < 10; i++) {
      newDice.push(generateDie());
    }

    return newDice;
  }

  function rollDice() {
    if (!Tenzies) {
      setDiceArray((oldDice) =>
        oldDice.map((die) => {
          return die.isHeld ? die : generateDie();
        })
      );
    } else {
      setTenzies((preTenzies) => !preTenzies);
      setDiceArray(generateDiceArray());
    }
  }

  function holdkey(id) {
    setDiceArray((preDiceArray) =>
      preDiceArray.map((die) => {
        return die.id === id ? { ...die, isHeld: !die.isHeld } : die;
      })
    );
  }

  const diceElements = DiceArray.map((die) => (
    <Dice
      key={die.id}
      value={die.value}
      isHeld={die.isHeld}
      holdkey={() => holdkey(die.id)}
    />
  ));

  const { width, height } = useWindowSize();

  return (
    <main className="main">
      {Tenzies && <Confetti width={width} height={height} />}
      <h1 className="app--title">Tenzies</h1>
      <p className="roll--desc">
        Roll until all dice are the same. Click each die to freeze it at its
        current value between rolls.
      </p>
      <div className="dice--box">{diceElements}</div>
      <button className="btn--change" onClick={rollDice}>
        {Tenzies ? "New Game" : "Roll Dice"}
      </button>
    </main>
  );
}
