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
    title: string;
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
}

const QuizCard: React.FC<QuizCardProps> = ({ answerOptions, personInQuestion, onNextQuestion }: QuizCardProps) => {
    const initialButtonStates: ButtonStates = {
        answer0: { clicked: false, borderColor: 'rgba(0, 123, 255, 0.3)' },
        answer1: { clicked: false, borderColor: 'rgba(0, 123, 255, 0.3)' },
        answer2: { clicked: false, borderColor: 'rgba(0, 123, 255, 0.3)' },
        answer3: { clicked: false, borderColor: 'rgba(0, 123, 255, 0.3)' },
    };

    const [buttonStates, setButtonStates] = useState<ButtonStates>(initialButtonStates);
    const [questionAnswered, setQuestionAnswered] = useState<boolean>(false);
    const [isCorrectAnswer, setIsCorrectAnswer] = useState<boolean>(false);
    
    useEffect(() => {
        console.log("Correct Answer: " + personInQuestion?.homeworld?.name);
    }, [personInQuestion])

    const getBackgroundColor = (clicked: boolean, correctAnswer: boolean): string => {
        const disabledColor: string = 'rgba(125, 125, 125, 0.3)';
        const successColor: string = '#4cd964';
        const failColor: string = '#ff3b30';

        if (clicked) {
            return correctAnswer ? successColor : failColor;
        }

        return disabledColor;
    };

    const answerButtonHandler = (buttonName: keyof ButtonStates, title: string) => {
        const correctAnswer = title === personInQuestion?.homeworld?.name;

        setIsCorrectAnswer(correctAnswer);
        setQuestionAnswered(true);
        setButtonStates(() => ({
            answer0: { clicked: buttonName === 'answer0' ? true : false, borderColor: getBackgroundColor(buttonName === 'answer0' ? true : false, correctAnswer) },
            answer1: { clicked: buttonName === 'answer1' ? true : false, borderColor: getBackgroundColor(buttonName === 'answer1' ? true : false, correctAnswer) },
            answer2: { clicked: buttonName === 'answer2' ? true : false, borderColor: getBackgroundColor(buttonName === 'answer2' ? true : false, correctAnswer) },
            answer3: { clicked: buttonName === 'answer3' ? true : false, borderColor: getBackgroundColor(buttonName === 'answer3' ? true : false, correctAnswer) }
        }));
    };

    const nextQuestionButtonHandler = () => {
        setButtonStates(initialButtonStates);
        setQuestionAnswered(false);
        onNextQuestion(isCorrectAnswer);
    };

    const AnswerButton = ({ answerButton, title }: AnswerButtonProps): JSX.Element => {
        return (
            <TouchableOpacity style={[styles.answerButton, { borderColor: buttonStates[answerButton].borderColor }]} onPress={() => answerButtonHandler(answerButton, title)} disabled={questionAnswered}>
                <Text style={styles.answerText} numberOfLines={1} adjustsFontSizeToFit>{title}</Text>
            </TouchableOpacity>
        );
    };

    const renderAnswers = () => {
        return (
            <View style={styles.answerContainer}>
                <View style={styles.row}>
                    <AnswerButton answerButton={'answer0'} title={answerOptions[0]?.name ?? 'No Answer'} />
                    <AnswerButton answerButton={'answer1'} title={answerOptions[1]?.name ?? 'No Answer'} />
                </View>
                <View style={styles.row}>
                    <AnswerButton answerButton={'answer2'} title={answerOptions[2]?.name ?? 'No Answer'} />
                    <AnswerButton answerButton={'answer3'} title={answerOptions[3]?.name ?? 'No Answer'} />
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