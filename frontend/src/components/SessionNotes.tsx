import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const NotesContainer = styled.div`
  padding: 1.5rem;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const NotesHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
`;

const NotesTitle = styled.h3`
  margin: 0;
  color: #333;
  flex: 1;
`;

const SaveButton = styled.button<{ saved: boolean }>`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  
  ${props => props.saved ? `
    background: #28a745;
    color: white;
  ` : `
    background: #007bff;
    color: white;
    &:hover { background: #0056b3; }
  `}
`;

const NotesTextArea = styled.textarea`
  flex: 1;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 1rem;
  line-height: 1.5;
  resize: none;
  
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
  }
`;

const NotesFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
  font-size: 0.875rem;
  color: #666;
`;

const WordCount = styled.span`
  color: #999;
`;

const LastSaved = styled.span`
  color: #666;
`;

const TemplateSection = styled.div`
  margin-bottom: 1.5rem;
`;

const TemplateTitle = styled.h4`
  margin: 0 0 1rem 0;
  color: #333;
  font-size: 1rem;
`;

const TemplateButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const TemplateButton = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  color: #666;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s;
  
  &:hover {
    background: #f8f9fa;
    border-color: #007bff;
    color: #007bff;
  }
`;

const ProgressSection = styled.div`
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
`;

const ProgressTitle = styled.h4`
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 0.875rem;
`;

const ProgressBar = styled.div`
  background: #e9ecef;
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ progress: number }>`
  background: #007bff;
  height: 100%;
  width: ${props => props.progress}%;
  transition: width 0.3s ease;
`;

const ProgressText = styled.div`
  font-size: 0.75rem;
  color: #666;
  margin-top: 0.5rem;
`;

interface SessionNotesProps {
  sessionId: string;
  userId: string;
  userType: 'teacher' | 'learner';
}

const SessionNotes: React.FC<SessionNotesProps> = ({ sessionId, userId, userType }) => {
  const [notes, setNotes] = useState('');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(true);
  const [sessionProgress, setSessionProgress] = useState(25);

  // Auto-save functionality
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!saved && notes) {
        handleSaveNotes();
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [notes, saved]);

  // Load existing notes
  useEffect(() => {
    loadNotes();
  }, [sessionId, userId]);

  const loadNotes = async () => {
    // Mock loading notes - replace with API call
    setTimeout(() => {
      const mockNotes = userType === 'teacher' 
        ? `Session Notes for ${sessionId}

Objectives:
- Review previous lesson
- Introduce new concepts
- Practice exercises

Student Progress:
- Good understanding of basics
- Needs work on advanced topics

Next Steps:
- Assign practice exercises
- Schedule follow-up session`
        : `Learning Notes for ${sessionId}

Key Takeaways:
- Learned new concepts
- Need to practice more

Questions:
- Ask about advanced techniques

Homework:
- Complete practice exercises`;
      
      setNotes(mockNotes);
      setLastSaved(new Date());
    }, 500);
  };

  const handleSaveNotes = async () => {
    setSaving(true);
    // Mock save - replace with API call
    setTimeout(() => {
      setLastSaved(new Date());
      setSaved(true);
      setSaving(false);
    }, 500);
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
    setSaved(false);
  };

  const insertTemplate = (template: string) => {
    const templates = {
      objectives: `\nSession Objectives:
- [ ] Review previous material
- [ ] Introduce new concepts
- [ ] Practice exercises
- [ ] Q&A session\n`,
      
      progress: `\nStudent Progress:
- Strengths: 
- Areas for improvement: 
- Completed topics: 
- Next focus areas: \n`,
      
      homework: `\nHomework/Action Items:
- [ ] Practice exercise 1
- [ ] Read chapter X
- [ ] Prepare questions for next session
- [ ] Review notes\n`,
      
      feedback: `\nSession Feedback:
- What went well: 
- What could be improved: 
- Student engagement: 
- Teaching effectiveness: \n`
    };
    
    setNotes(prev => prev + templates[template as keyof typeof templates]);
    setSaved(false);
  };

  const wordCount = notes.trim().split(/\s+/).filter(word => word.length > 0).length;

  return (
    <NotesContainer>
      <NotesHeader>
        <NotesTitle>
          {userType === 'teacher' ? 'Teaching Notes' : 'Learning Notes'}
        </NotesTitle>
        <SaveButton 
          saved={saved} 
          onClick={handleSaveNotes}
          disabled={saving}
        >
          {saving ? 'Saving...' : saved ? '✓ Saved' : 'Save Notes'}
        </SaveButton>
      </NotesHeader>

      {userType === 'teacher' && (
        <>
          <ProgressSection>
            <ProgressTitle>Session Progress</ProgressTitle>
            <ProgressBar>
              <ProgressFill progress={sessionProgress} />
            </ProgressBar>
            <ProgressText>
              {sessionProgress}% complete - Keep track of lesson progress
            </ProgressText>
          </ProgressSection>

          <TemplateSection>
            <TemplateTitle>Quick Templates</TemplateTitle>
            <TemplateButtons>
              <TemplateButton onClick={() => insertTemplate('objectives')}>
                📋 Objectives
              </TemplateButton>
              <TemplateButton onClick={() => insertTemplate('progress')}>
                📈 Progress
              </TemplateButton>
              <TemplateButton onClick={() => insertTemplate('homework')}>
                📚 Homework
              </TemplateButton>
              <TemplateButton onClick={() => insertTemplate('feedback')}>
                💭 Feedback
              </TemplateButton>
            </TemplateButtons>
          </TemplateSection>
        </>
      )}

      <NotesTextArea
        value={notes}
        onChange={handleNotesChange}
        placeholder={
          userType === 'teacher' 
            ? "Record your teaching notes, student progress, and session observations here..."
            : "Take notes on what you're learning, questions to ask, and key takeaways..."
        }
      />

      <NotesFooter>
        <WordCount>{wordCount} words</WordCount>
        {lastSaved && (
          <LastSaved>
            Last saved: {lastSaved.toLocaleTimeString()}
          </LastSaved>
        )}
      </NotesFooter>
    </NotesContainer>
  );
};

export default SessionNotes;