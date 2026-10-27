import { useEffect, useMemo, useRef, useState } from 'react'
import { shuffle } from '../logic/questionPicker'
import { play } from '../logic/sound'
import { hasVietnameseVoice, speak, stopSpeaking, toSpeech } from '../logic/speech'
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
  const [voiceOk, setVoiceOk] = useState(true)
  const firstBtn = useRef<HTMLButtonElement>(null)
  const spoken = question.speech ?? toSpeech(question.prompt)
  const pictures = question.visuals

  // Read the question aloud when it opens; stop when it closes.
  useEffect(() => {
    let live = true
    void hasVietnameseVoice().then((ok) => live && setVoiceOk(ok))
    const t = setTimeout(() => speak(spoken), 450)
    return () => {
      live = false
      clearTimeout(t)
      stopSpeaking()
    }
  }, [spoken])

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
      setTimeout(() => speak(`Đúng rồi! Giỏi quá! ${toSpeech(question.explanation)}`), 500)
    } else {
      play('wrong')
      setWrong((w) => [...w, c])
      setTimeout(() => speak(`Chưa đúng rồi. Con thử lại nhé. ${toSpeech(question.hint)}`), 350)
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
        {question.emoji && (
          <div className="q-emoji" aria-hidden="true">
            {question.emoji}
          </div>
        )}

        <button className="speaker" onClick={() => speak(spoken)} aria-label="Nghe lại câu hỏi" data-testid="speaker">
          <span aria-hidden="true">🔊</span> Nghe lại
        </button>

        <h2 id="q-prompt" className={`q-prompt${pictures ? ' q-prompt-small' : ''}`} data-testid="q-prompt">
          {question.prompt}
        </h2>

        <div className={`choices${pictures ? ' choices-pic' : ''}`}>
          {choices.map((c, i) => {
            const isWrong = wrong.includes(c)
            const isRight = solved && c === question.answer
            return (
              <button
                key={c}
                ref={i === 0 ? firstBtn : undefined}
                className={`choice${pictures ? ' choice-pic' : ''}${isWrong ? ' choice-wrong' : ''}${isRight ? ' choice-right' : ''}`}
                disabled={isWrong || solved}
                aria-label={isWrong ? `${c} – chưa đúng` : isRight ? `${c} – đúng rồi` : c}
                onClick={() => answer(c)}
              >
                {pictures ? (
                  <>
                    <span className="pic" aria-hidden="true">
                      {pictures[c] ?? c}
                    </span>
                    <span className="pic-label" aria-hidden="true">
                      {isWrong && '✗ '}
                      {isRight && '✓ '}
                      {c}
                    </span>
                  </>
                ) : (
                  <>
                    {isWrong && <span aria-hidden="true">✗ </span>}
                    {isRight && <span aria-hidden="true">✓ </span>}
                    {c}
                  </>
                )}
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
            <p className="fb-hint">Nghe câu hỏi rồi chọn đáp án đúng để mở khóa nhé!</p>
          )}
          {!voiceOk && (
            <p className="fb-warn" data-testid="no-voice">
              🔇 Máy chưa có giọng đọc tiếng Việt, nhờ người lớn đọc câu hỏi giúp bé nhé.
            </p>
          )}
        </div>

        {solved ? (
          <button className="btn btn-green btn-big" onClick={onClose} data-testid="wear-now">
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
