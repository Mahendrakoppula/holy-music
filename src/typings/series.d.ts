 interface Hindi {
  value: string
  options: Option[]
  
}
 interface English {
  value: string
  options: Option[]
}

 interface Option {
  prompt: string
  value: string
}
 interface QuestionTypes {
  type: string
  QSNo: number
  SSNo: number
  SSSNo: number
  hindi: Hindi
  english: English
  marks: Marks
}

 interface Marks {
  positive: number
  negative: number
}

export interface SeriesTypes {
  uid: string
  slug: string
  time: string
  title: string
  is_saved: string
  is_marked: string
  question_score: string
  user_attempt_list: string
  questions: QuestionTypes[]
}


