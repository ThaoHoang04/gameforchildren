import { useEffect, useMemo, useRef, useState } from 'react'
import { shuffle } from '../logic/questionPicker'
import { play } from '../logic/sound'
import type { Item, Question } from '../types'
import { ItemThumb } from './Doll'

interface Props {
  question: Question
  item: Item
  onCorrect: () => void
  onClose: () => void
}

export function QuestionModal({ question, item, onCorrect, onClose }: Props) {
  const choices = useMemo(() => shuffle(question.choices), [question])
  const [wrong, setWrong] = useState<string[]>([])
  const [solved, setSolved] = useState(false)
  const firstBtn = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    firstBtn.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && !solved && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, solved])

  const answer = (c: string) => {
    if (solved || wrong.includes(c)) return
    if (c === question.answer) {
      setSolved(true)
      play('correct')
      onCorrect()
    } else {
      play('wrong')
      setWrong((w) => [...w, c])
    }
  }

  const subjectLabel = question.subject === 'math' ? '🔢 Toán' : '📖 Tiếng Việt'

  return (
    <div className="overlay" role="presentation">
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="q-prompt" data-testid="question-modal">
        <div className="modal-head">
          <span className="chip">{subjectLabel}</span>
          <div className="modal-item">
            <ItemThumb item={item} locked />
            <span>{item.name}</span>
          </div>
        </div>

        {solved && (
          <div className="confetti" aria-hidden="true">
            {['🎉', '⭐', '💖', '✨', '🌸', '🎀', '⭐', '💖'].map((e, i) => (
              <span key={i} style={{ ['--i' as string]: i }}>
                {e}
              </span>
            ))}
          </div>
        )}
        {question.emoji && <div className="q-emoji" aria-hidden="true">{question.emoji}</div>}
        <h2 id="q-prompt" className="q-prompt" data-testid="q-prompt">
          {question.prompt}
        </h2>

        <div className="choices">
          {choices.map((c, i) => {
            const isWrong = wrong.includes(c)
            const isRight = solved && c === question.answer
            return (
              <button
                key={c}
                ref={i === 0 ? firstBtn : undefined}
                className={`choice${isWrong ? ' choice-wrong' : ''}${isRight ? ' choice-right' : ''}`}
                disabled={isWrong || solved}
                aria-label={isWrong ? `${c} – chưa đúng` : isRight ? `${c} – đúng rồi` : c}
                onClick={() => answer(c)}
              >
                {isWrong && <span aria-hidden="true">✗ </span>}
                {isRight && <span aria-hidden="true">✓ </span>}
                {c}
              </button>
            )
          })}
        </div>

        <div className="feedback" role="status" aria-live="polite">
          {solved ? (
            <p className="fb-good" data-testid="fb-good">
              🎉 Đúng rồi! {question.explanation}
            </p>
          ) : wrong.length > 0 ? (
            <p className="fb-hint" data-testid="fb-hint">
              🤔 Chưa đúng rồi, bé thử lại nhé! <br />
              💡 Gợi ý: {question.hint}
            </p>
          ) : (
            <p className="fb-hint">Trả lời đúng để mở khóa món đồ này nhé!</p>
          )}
        </div>

        {solved ? (
          <button className="btn btn-primary" onClick={onClose} data-testid="wear-now">
            ✨ Mặc ngay!
          </button>
        ) : (
          <button className="btn btn-ghost" onClick={onClose}>
            Để sau
          </button>
        )}
      </div>
    </div>
  )
}
