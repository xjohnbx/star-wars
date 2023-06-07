import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '@rneui/base';
import QuizCard from './QuizCard';
import { Person, Planet } from '../__generated__/graphql';

type QuizProps = {
  peopleArray: Person[];
  planetsArray: Planet[];
}

const Quiz: React.FC<QuizProps> = ({ peopleArray, planetsArray }: QuizProps): JSX.Element => {
    const [questionCount, setQuestionCount] = useState<number>(1);
    const [correctCount, setCorrectCount] = useState<number>(0);
    const [idInQuestionsArray, setIdInQuestionsArray] = useState<string[]>([]);
    const [currentPersonInQuestion, setCurrentPersonInQuestion] = useState<Person>();
    const [currentAnswers, setCurrentAnswers] = useState<Planet[]>([]);
    
    useEffect(() => {
        if (peopleArray && planetsArray) {
          setRandomPerson();
        }
    }, [peopleArray, planetsArray]);

    useEffect(() => {
      if (planetsArray) {
        let answers = createAnswerArray();
        setCurrentAnswers(answers);
      }
    }, [currentPersonInQuestion])

    const nextQuestionHandler = (correctAnswer: boolean) => {
        if (correctAnswer) {
          setCorrectCount(correctCount => correctCount + 1);
        }
        setQuestionCount(questionCount => questionCount + 1);
        setRandomPerson();
    };


    const setRandomPerson = () => {
        const availablePeopleToChoose: Person[] = peopleArray.filter((person: Person) => !idInQuestionsArray.includes(person.id));
        const random: number = Math.floor(Math.random() * availablePeopleToChoose?.length);
        const randomPerson: Person = availablePeopleToChoose[random];
        
        setIdInQuestionsArray(prevState => [...prevState, randomPerson?.id]);
        setCurrentPersonInQuestion(randomPerson);
    };

    const createAnswerArray = (): Planet[] => {
        const newAnswerArray: Planet[] = planetsArray.filter((planet: Planet) => currentPersonInQuestion?.homeworld?.id !== planet?.id);
        let currentIndex: number = newAnswerArray.length;

        // Shuffle Array
        while (currentIndex > 0) {
            const randomIndex: number = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            [newAnswerArray[currentIndex], newAnswerArray[randomIndex]] = [
                newAnswerArray[randomIndex],
                newAnswerArray[currentIndex]
            ];
        }

        // Take 3 random planets
        const finalArray: Planet[] = newAnswerArray.slice(0, 3);

        // Add HomePlanet from currentPerson
        /* Note: Without creating a new class type for 'Planet' we can't create a new Planet();
                 This is a bug that will create a question without a correct answer if the currentPerson does not have a homeworld
                 * It seems that Person.homeworld will always have a value. As some of the droids have 'unknown' as the value.
        */

        // Generate random index to input in
        const index = Math.floor(Math.random() * (finalArray.length + 1));
        finalArray.splice(index, 0, currentPersonInQuestion?.homeworld ?? newAnswerArray[3]);
        
        return finalArray;
    };

    return (
        <View style={styles.container}>
            <View style={styles.quizContainer}>
              <Text style={styles.summaryText}> Q: {questionCount} / {peopleArray?.length ?? 0}</Text>
              {currentPersonInQuestion ? <QuizCard personInQuestion={currentPersonInQuestion} answerOptions={currentAnswers} onNextQuestion={nextQuestionHandler} /> : null}
              <Text style={styles.summaryText}> Results: {correctCount} / {questionCount - 1}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryText: {
    fontSize: 15,
  },
  quizContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Quiz;


/**
 * Next Features:
 *  1) Currently we only ask Person -> Planet. Add more connections:
 *      - Person -> Ship
 *      - Person -> Species
 *      - etc.
 *
 *  2) Put a limit on the amount of Questions. (82 is a lot)
 *      - This also takes care of a bug when trying to generate a name after 82 questions.
 *        The id array is completely full and would not allow for a random name to be generated.
 * 
 *  3) Highlight the correct answer if the user gets the question wrong.
 *      - Maybe do this by way of highlighting the text in green if they miss it
 * 
 *  4) Kind of an extension of number 2, but some sort of end screen where is displays at the end of the last question.
 * 
 *  5) If there was a database to hit, Keep a high score record.
 * 
 * 
 * Known Bugs:
 *  1) From (2 above): Generating a name after 82 have passed is impossible. The app doesn't crash, but a card never renders.
 * 
 * 
 * 
 * Known Refactors:
 *  1) My GraphQL  knowledge is limited, the way I pull these in and then copy and type into another array is bad.
 *        - Learning how GraphQL works more in depth / understanding the Connection and Edge types would help resolve this.
 *  
 *  2) In 'QuizCard.tsx' the renderAnswers function could be refactored. Specifically around the AnswerButtons. These are repeated 4 times, which is bad coding.
 *      I was having some issues when getting the buttons to highlight within a re-usable component.
 * 
 *  3) Some of the UI elements have hardcoded minWidth and minHeight values. If given a super small screen, these may create a view issues.
*/