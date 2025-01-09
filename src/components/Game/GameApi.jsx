// src/components/Game/GameAPI.js

import axios from 'axios';
import he from "he"



 export const fetchApiData = (apiToken,setQuizData) => {
    axios.get(`https://opentdb.com/api.php?amount=10&token=${apiToken}&type=multiple`).then((res) => {
      
     
      
      const dataResponse = res.data.results;

      setQuizData((prevState) => [
        ...prevState,
       ...dataResponse.map((item) => {
        const deCodedCorrectAnswer = he.decode(item.correct_answer);
        const decodedIncorrectAnswers = item.incorrect_answers.map((answer) => he.decode(answer))
        const shuffledAnswers = shuffleArray([deCodedCorrectAnswer,...decodedIncorrectAnswers])
        
        return {
          correctAnswer:deCodedCorrectAnswer,
          answers:shuffledAnswers,
          incorrectAnswers:decodedIncorrectAnswers,
          question:he.decode(item.question)
        }
       })
      ])
   
     })
  }

 export const fetchApiToken = async () => {
    try{
     const res = await axios.get("https://opentdb.com/api_token.php?command=request");
        return res.data.token;
    
    } catch(error){
      console.error("Error fetching token",error);
      return
    }
    
    
  }


 const shuffleArray = (array) => {
    for(let i = array.length -1; i > 0; i--){

      const randomIndex = Math.floor(Math.random() * (i + 1));

      [array[i], array[randomIndex]] = [array[randomIndex], array[i]];

    }
    return array;
  }

  
