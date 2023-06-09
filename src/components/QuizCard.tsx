import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Card } from '@rneui/base';
import { Button } from '@rneui/themed';
import { Person, Planet } from '../__generated__/graphql';

type QuizCardProps = {
    personInQuestion?: Person;
    answerOptions: Planet[];
    onNextQuestion: (correctAnswer: boolean) => void;
};

type AnswerButtonProps = {
    answerButton: keyof ButtonStates;
}

type ButtonStates = {
    answer0: ButtonState;
    answer1: ButtonState;
    answer2: ButtonState;
    answer3: ButtonState;
}

type ButtonState = {
    clicked: boolean;
    borderColor: string;
    textColor: string;
    title: string;
}

const QuizCard: React.FC<QuizCardProps> = ({ answerOptions, personInQuestion, onNextQuestion }: QuizCardProps) => {
    const [buttonStates, setButtonStates] = useState<ButtonStates>({
        answer0: { clicked: false, borderColor: 'rgba(0, 123, 255, 0.3)', textColor: 'black', title: answerOptions[0]?.name ?? 'No Answer' },
        answer1: { clicked: false, borderColor: 'rgba(0, 123, 255, 0.3)', textColor: 'black', title: answerOptions[1]?.name ?? 'No Answer' },
        answer2: { clicked: false, borderColor: 'rgba(0, 123, 255, 0.3)', textColor: 'black', title: answerOptions[2]?.name ?? 'No Answer' },
        answer3: { clicked: false, borderColor: 'rgba(0, 123, 255, 0.3)', textColor: 'black', title: answerOptions[3]?.name ?? 'No Answer' },
    });
    const [questionAnswered, setQuestionAnswered] = useState<boolean>(false);
    const [isCorrectAnswer, setIsCorrectAnswer] = useState<boolean>(false);
    
    useEffect(() => {
        console.log("Correct Answer: " + personInQuestion?.homeworld?.name);
    }, [personInQuestion]);

    useEffect(() => {

        // If answer options or personInQuestion has changed make sure button choices are in sync
        setButtonStates({
            answer0: { clicked: false, borderColor: 'rgba(0, 123, 255, 0.3)', textColor: 'black', title: answerOptions[0]?.name ?? 'No Answer' },
            answer1: { clicked: false, borderColor: 'rgba(0, 123, 255, 0.3)', textColor: 'black', title: answerOptions[1]?.name ?? 'No Answer' },
            answer2: { clicked: false, borderColor: 'rgba(0, 123, 255, 0.3)', textColor: 'black', title: answerOptions[2]?.name ?? 'No Answer' },
            answer3: { clicked: false, borderColor: 'rgba(0, 123, 255, 0.3)', textColor: 'black', title: answerOptions[3]?.name ?? 'No Answer' },
        });
    }, [answerOptions, personInQuestion])

    const calculateButtonState = (clicked: boolean, correctAnswer: boolean, title: string): ButtonState => {
        const disabledColor: string = 'rgba(125, 125, 125, 0.3)'; // gray
        const successColor: string = '#4cd964'; // green
        const failColor: string = '#ff3b30'; // red

        // if user chosen answer
        if (clicked) {
            return { 
                clicked: clicked, 
                borderColor: correctAnswer ? successColor : failColor, 
                textColor: correctAnswer ? successColor : failColor,
                title: title,
            };
        }

        return { 
            clicked: clicked, 
            borderColor: disabledColor,
            textColor: title === personInQuestion?.homeworld?.name ? successColor : 'rgb(125, 125, 125)', // is it the right answer?
            title: title
        };
    };

    const answerButtonHandler = (buttonName: keyof ButtonStates) => {
        const correctAnswer = buttonStates[buttonName].title === personInQuestion?.homeworld?.name;

        setIsCorrectAnswer(correctAnswer);
        
        // disable answer buttons + enable nextQuestion button
        setQuestionAnswered(true);
        setButtonStates(() => ({     
            answer0: calculateButtonState(buttonName === 'answer0' ? true : false, correctAnswer, buttonStates['answer0'].title),
            answer1: calculateButtonState(buttonName === 'answer1' ? true : false, correctAnswer, buttonStates['answer1'].title),
            answer2: calculateButtonState(buttonName === 'answer2' ? true : false, correctAnswer, buttonStates['answer2'].title),
            answer3: calculateButtonState(buttonName === 'answer3' ? true : false, correctAnswer, buttonStates['answer3'].title),
        }));
    };

    const nextQuestionButtonHandler = () => {

        // reset buttons to be enabled for next Question
        setQuestionAnswered(false);
        onNextQuestion(isCorrectAnswer);
    };

    const AnswerButton = ({ answerButton }: AnswerButtonProps): JSX.Element => {
        return (
            <TouchableOpacity style={[styles.answerButton, { borderColor: buttonStates[answerButton].borderColor }]} onPress={() => answerButtonHandler(answerButton)} disabled={questionAnswered}>
                <Text style={[styles.answerText, { color: buttonStates[answerButton].textColor }]} numberOfLines={1} adjustsFontSizeToFit>{buttonStates[answerButton].title}</Text>
            </TouchableOpacity>
        );
    };

    const renderAnswers = () => {
        return (
            <View style={styles.answerContainer}>
                <View style={styles.row}>
                    <AnswerButton answerButton={'answer0'} />
                    <AnswerButton answerButton={'answer1'} />
                </View>
                <View style={styles.row}>
                    <AnswerButton answerButton={'answer2'} />
                    <AnswerButton answerButton={'answer3'} />
                </View>
            </View>
        );
    }

    return (
        <View style={styles.outerContainer}>
            <Card containerStyle={styles.cardContainer}>
                <View style={{ flex: 1, minWidth: 200, padding: 10 }}>
                    <Card.Title>
                        {`What planet is ${personInQuestion?.name ?? 'Yoda'} from?`}
                    </Card.Title>
                    <Card.Divider />
                    {renderAnswers()}
                    <Button
                        title="Next Question"
                        disabled={!questionAnswered}
                        buttonStyle={{
                            borderColor: 'rgba(78, 116, 289, 1)',
                        }}
                        type="outline"
                        raised
                        onPress={nextQuestionButtonHandler}
                    />
                </View>
            </Card>

        </View>
    );
};

const styles = StyleSheet.create({
    answerButton: {
        minHeight: 50,
        minWidth: 150,
        margin: 8,
        borderRadius: 5,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    answerContainer: {
        minWidth: 200,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    answerText: {
        fontSize: 15,
        textAlign: 'center',
    },
    cardContainer: {
        minWidth: 300,
        height: '90%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    outerContainer: {
        height: '90%',
        width: '100%',
    },
    row: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    questionText: {
        fontSize: 15,
        textAlign: 'center',
        alignContent: 'center',
    },
});

export default QuizCard;