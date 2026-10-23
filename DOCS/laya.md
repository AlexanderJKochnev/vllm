# LAYA-AI

## embedding
curl http://localhost:8080/embeddings \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Пример текста для обработки моделью принятия решений"
  }'

## да / нет
curl http://localhost:8080/v1/systemone \
  -H "Content-Type: application/json" \
  -d '{
    "state": "I was charged twice for my order #4471 and I want a refund.",
    "questions": {
      "refund": {
        "type": "noul",
        "instructions": "Is a refund requested?"
      }
    }
  }'

## scoring 
curl http://localhost:8080/v1/systemone \
  -H "Content-Type: application/json" \
  -d '{
    "state": {
      "source": "Привет, я хотел бы забронировать столик на двоих на сегодня вечером.",
      "translation": "Hello, I would like to book a table for two for tonight."
    },
    "questions": {
      "translation_quality": {
        "type": "score",
        "instructions": "How would you rate the quality of the English translation of the Russian source text?",
        "criteria": ["poor", "acceptable", "good", "excellent"]
      }
    }
  }'


## 
curl http://localhost:8080/v1/systemone \
  -H "Content-Type: application/json" \
  -d '{
    "state": {
      "source": "The palate seems rich with flavors of honey, lanolin and ripe, penetrating yellow peach and mango, but the texture and mouthfeel here are as light as a feather. It'\''s intensely juicy and fruity, but racy acidity and a crushed-slate minerality lends focus and balance.",
      "translation": "Вкус кажется богатым оттенками мёда, ланолина и спелого, пронзительно яркого персика и манго, но текстура и ощущение здесь лёгкие, как перышко. Он интенсивно сочный и фруктовый, но яркая кислинка и минеральные оттенки, напоминающие сланец, придают ему концентрацию и баланс."
    },
    "questions": {
      "translation_quality": {
        "type": "score",
        "instructions": "How would you rate the quality of the Russian translation of the English source text?",
        "criteria": ["poor", "acceptable", "good", "excellent"]
      }
    }
  }'

##
curl http://localhost:8080/v1/systemone \
  -H "Content-Type: application/json" \
  -d '{
    "state": {
      "source": "The palate seems rich with flavors of honey, lanolin and ripe, penetrating yellow peach and mango, but the texture and mouthfeel here are as light as a feather. It'\''s intensely juicy and fruity, but racy acidity and a crushed-slate minerality lends focus and balance.",
      "translation": "Вкус кажется богатым оттенками мёда, ланолина и спелым, пронзительно ярким персиком и манго, но текстура и ощущение здесь лёгкие, как перышко. Он интенсивно сочный и фруктовый, но яркая кислинка и минеральность колотого сланца придают ему сосредоточенность и баланс."
    },
    "questions": {
      "quality": {
        "type": "score",
        "instructions": "Wine-tasting note translated from English to Russian. Rate the Russian translation.",
        "criteria": ["poor", "acceptable", "good", "excellent"]
      },
      "meaning_errors": {
        "type": "noul",
        "instructions": "Does the Russian translation contain meaning errors relative to the English source (wrong terms, shifted meaning)?"
      },
      "grammar_ok": {
        "type": "noul",
        "instructions": "Is the Russian translation grammatically correct and natural?"
      },
      "terminology_ok": {
        "type": "noul",
        "instructions": "Are wine-tasting terms translated correctly?"
      }
    }
  }'
##
curl http://localhost:8080/v1/systemone \
  -H "Content-Type: application/json" \
  -d '{
    "state": {
      "source": "The palate seems rich with flavors of honey, lanolin and ripe, penetrating yellow peach and mango, but the texture and mouthfeel here are as light as a feather. It'\''s intensely juicy and fruity, but racy acidity and a crushed-slate minerality lends focus and balance.",
      "translation": "Вкус кажется богатым оттенками мёда, ланолина и спелого, проникновенно яркого персика и манго, но текстура и ощущение здесь лёгкие, как перышко. Он интенсивно сочный и фруктовый, но яркая кислинка и минеральность колотого сланца придают концентрацию и баланс."
    },
    "questions": {
      "contradicts_source": {
        "type": "noul",
        "instructions": "Does the Russian translation contradict the meaning of the English source in any way?"
      },
      "natural_russian": {
        "type": "noul",
        "instructions": "Does the Russian text read naturally, as if written by a native speaker?"
      },
      "grammar_errors": {
        "type": "noul",
        "instructions": "Does the Russian text contain grammatical errors (agreement, gender, number, tense)?"
      },
      "lexical_errors": {
        "type": "noul",
        "instructions": "Does the Russian text contain lexical errors (wrong word choice, awkward collocations)?"
      },
      "overall": {
        "type": "score",
        "instructions": "Rate the overall quality of the Russian translation, allowing for free (non-literal) rendering.",
        "criteria": ["poor", "acceptable", "good", "excellent"]
      }
    }
  }'
## GERMAN

curl http://localhost:8080/v1/systemone \
  -H "Content-Type: application/json" \
  -d '{
    "state": {
      "source": "The palate seems rich with flavors of honey, lanolin and ripe, penetrating yellow peach and mango, but the texture and mouthfeel here are as light as a feather. It'\''s intensely juicy and fruity, but racy acidity and a crushed-slate minerality lends focus and balance.",
      "translation": "Der Gaumen erscheint reich an Aromen von Honig, Lanolin und reifen, eindringenden gelben Pfirsich und Mango, aber die Textur und der Mundgefühl sind so leicht wie ein Feder. Es ist intensiv fruchtig und saftig, doch eine prickelnde Säure und eine mineralische Note, die an zerbrochenen Schiefer erinnert, verleihen Fokus und Ausgewogenheit."
    },
    "questions": {
      "contradicts_source": {
        "type": "noul",
        "instructions": "Does the Germany translation contradict the meaning of the English source in any way?"
      },
      "natural_russian": {
        "type": "noul",
        "instructions": "Does the Germany text read naturally, as if written by a native speaker?"
      },
      "grammar_errors": {
        "type": "noul",
        "instructions": "Does the Germany text contain grammatical errors (agreement, gender, number, tense)?"
      },
      "lexical_errors": {
        "type": "noul",
        "instructions": "Does the Germany text contain lexical errors (wrong word choice, awkward collocations)?"
      },
      "overall": {
        "type": "score",
        "instructions": "Rate the overall quality of the Germany translation, allowing for free (non-literal) rendering.",
        "criteria": ["poor", "acceptable", "good", "excellent"]
      }
    }
  }'

response
{"model":"/models/Laya-BF16.gguf","answers":{"contradicts_source":{"type":"noul","noul":0.09338916340070366},"natural_russian":{"type":"noul","noul":0.2692869389153235},"grammar_errors":{"type":"noul","noul":0.19976751106320492},"lexical_errors":{"type":"noul","noul":0.22826498121870845},"overall":{"type":"score","score":1.8761976686312702,"legend":{"0":"poor","1":"acceptable","2":"good","3":"excellent"},"probabilities":{"0":0.029733685085946295,"1":0.36567450367061927,"2":0.30325226876965244,"3":0.30133954247378203},"confidence":0.06433496119683713}},"usage":{"input_tokens":1149,"output_tokens":0}}