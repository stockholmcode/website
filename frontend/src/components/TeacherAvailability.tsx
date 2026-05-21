import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Course, TeacherAvailability as AvailabilityType, AvailabilityCreateRequest, SessionFormat } from '../types/session';

const Container = styled.div`
  padding: 0;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  color: #333;
  margin: 0;
`;

const AddButton = styled.button`
  background: #28a745;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background: #218838;
  }
`;

const AvailabilityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const AvailabilityCard = styled.div<{ isActive: boolean }>`
  background: white;
  border: 1px solid #ddd;
  border-left: 4px solid ${props => props.isActive ? '#28a745' : '#6c757d'};
  border-radius: 8px;
  padding: 1.5rem;
  transition: transform 0.2s, box-shadow 0.2s;
  opacity: ${props => props.isActive ? 1 : 0.7};
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const AvailabilityHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const AvailabilityInfo = styled.div`
  flex: 1;
`;

const DateTimeInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
`;

const DateBadge = styled.span`
  background: #007bff;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 500;
`;

const TimeRange = styled.span`
  color: #333;
  font-weight: 500;
  font-size: 1.1rem;
`;

const CourseTitle = styled.h3`
  margin: 0 0 0.25rem 0;
  color: #333;
  font-size: 1.1rem;
`;

const CourseSkill = styled.div`
  color: #007bff;
  font-weight: 500;
  font-size: 0.875rem;
`;

const StatusBadge = styled.span<{ active: boolean }>`
  background: ${props => props.active ? '#d4edda' : '#f8d7da'};
  color: ${props => props.active ? '#155724' : '#721c24'};
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
`;

const AvailabilityDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin: 1rem 0;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 6px;
`;

const DetailItem = styled.div`
  font-size: 0.875rem;
`;

const DetailLabel = styled.div`
  color: #666;
  font-weight: 500;
  margin-bottom: 0.25rem;
`;

const DetailValue = styled.div`
  color: #333;
`;

const AvailabilityActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  flex-wrap: wrap;
`;

const ActionButton = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;
  
  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background: #007bff;
          color: white;
          &:hover { background: #0056b3; }
        `;
      case 'danger':
        return `
          background: #dc3545;
          color: white;
          &:hover { background: #c82333; }
        `;
      default:
        return `
          background: #6c757d;
          color: white;
          &:hover { background: #545b62; }
        `;
    }
  }}
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 8px;
  padding: 2rem;
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ModalTitle = styled.h3`
  margin: 0;
  color: #333;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  
  &:hover {
    color: #333;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #333;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  background: white;
  
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  min-height: 80px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }
`;

const FormActions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
`;

const SubmitButton = styled.button`
  background: #28a745;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  
  &:hover {
    background: #218838;
  }
  
  &:disabled {
    background: #6c757d;
    cursor: not-allowed;
  }
`;

const CancelButton = styled.button`
  background: #6c757d;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background: #545b62;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #666;
`;

const FilterControls = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 2rem;
`;

const FilterSelect = styled.select`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
`;

interface TeacherAvailabilityProps {
  teacherId: string;
}

const TeacherAvailability: React.FC<TeacherAvailabilityProps> = ({ teacherId }) => {
  const [availabilities, setAvailabilities] = useState<AvailabilityType[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAvailability, setEditingAvailability] = useState<AvailabilityType | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Form state
  const [formData, setFormData] = useState<AvailabilityCreateRequest>({
    date: '',
    startTime: '09:00',
    endTime: '10:00',
    courseId: '',
    maxStudents: 1,
    virtualMeetingUrl: '',
    location: ''
  });

  // Mock data - replace with API calls
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setTimeout(() => {
        const mockCourses: Course[] = [
          // Teacher's own courses
          {
            id: '1',
            teacherId: teacherId,
            title: 'Beginner Guitar Fundamentals',
            description: 'Learn the basics of guitar playing',
            skillName: 'Guitar',
            cost: 50,
            duration: 60,
            format: SessionFormat.HYBRID,
            images: [],
            learningObjectives: ['Master basic chords', 'Learn strumming patterns'],
            isActive: true,
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
            availabilities: []
          },
          {
            id: '2',
            teacherId: teacherId,
            title: 'Advanced Guitar Techniques',
            description: 'Advanced guitar skills',
            skillName: 'Guitar',
            cost: 75,
            duration: 90,
            format: SessionFormat.IN_PERSON,
            images: [],
            learningObjectives: ['Master barre chords', 'Learn fingerpicking'],
            isActive: true,
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
            availabilities: []
          },
          {
            id: '3',
            teacherId: teacherId,
            title: 'Spanish Conversation Practice',
            description: 'Improve your Spanish speaking skills',
            skillName: 'Spanish',
            cost: 40,
            duration: 45,
            format: SessionFormat.ONLINE,
            images: [],
            learningObjectives: ['Improve pronunciation', 'Build confidence'],
            isActive: true,
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
            availabilities: []
          },
          // Other teacher's courses (should not appear in dropdown)
          {
            id: '4',
            teacherId: 'other-teacher-id',
            title: 'Piano Lessons for Beginners',
            description: 'Learn piano basics',
            skillName: 'Piano',
            cost: 60,
            duration: 60,
            format: SessionFormat.IN_PERSON,
            images: [],
            learningObjectives: ['Learn basic keys', 'Simple melodies'],
            isActive: true,
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
            availabilities: []
          }
        ];

        const mockAvailabilities: AvailabilityType[] = [
          {
            id: '1',
            teacherId: teacherId,
            date: '2024-01-25',
            startTime: '09:00',
            endTime: '10:00',
            courseId: '1',
            courseName: 'Beginner Guitar Fundamentals',
            maxStudents: 2,
            virtualMeetingUrl: 'https://meet.google.com/guitar-basics',
            location: '123 Music Studio, Room A',
            isActive: true,
            createdAt: '2024-01-20T00:00:00Z',
            updatedAt: '2024-01-20T00:00:00Z'
          },
          {
            id: '2',
            teacherId: teacherId,
            date: '2024-01-25',
            startTime: '14:00',
            endTime: '15:30',
            courseId: '2',
            courseName: 'Advanced Guitar Techniques',
            maxStudents: 1,
            location: '123 Music Studio, Room B',
            isActive: true,
            createdAt: '2024-01-20T00:00:00Z',
            updatedAt: '2024-01-20T00:00:00Z'
          },
          {
            id: '3',
            teacherId: teacherId,
            date: '2024-01-26',
            startTime: '16:00',
            endTime: '16:45',
            courseId: '3',
            courseName: 'Spanish Conversation Practice',
            maxStudents: 3,
            virtualMeetingUrl: 'https://zoom.us/j/spanish-practice',
            isActive: false,
            createdAt: '2024-01-20T00:00:00Z',
            updatedAt: '2024-01-20T00:00:00Z'
          }
        ];

        setCourses(mockCourses);
        setAvailabilities(mockAvailabilities);
        setLoading(false);
      }, 800);
    };

    loadData();
  }, [teacherId]);

  const filteredAvailabilities = availabilities.filter(availability => {
    if (statusFilter === 'active') return availability.isActive;
    if (statusFilter === 'inactive') return !availability.isActive;
    return true;
  });

  const resetForm = () => {
    setFormData({
      date: '',
      startTime: '09:00',
      endTime: '10:00',
      courseId: '',
      maxStudents: 1,
      virtualMeetingUrl: '',
      location: ''
    });
    setEditingAvailability(null);
  };

  const openModal = (availability?: AvailabilityType) => {
    if (availability) {
      setEditingAvailability(availability);
      setFormData({
        date: availability.date,
        startTime: availability.startTime,
        endTime: availability.endTime,
        courseId: availability.courseId,
        maxStudents: availability.maxStudents,
        virtualMeetingUrl: availability.virtualMeetingUrl || '',
        location: availability.location || ''
      });
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleInputChange = (field: keyof AvailabilityCreateRequest, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.courseId || !formData.date) return;

    const selectedCourse = courses.find(c => c.id === formData.courseId);
    if (!selectedCourse) return;

    // Security check: Ensure the selected course belongs to this teacher
    if (selectedCourse.teacherId !== teacherId) {
      alert('Error: You can only create availability for your own courses.');
      return;
    }

    const availabilityData: AvailabilityType = {
      id: editingAvailability ? editingAvailability.id : Date.now().toString(),
      teacherId: teacherId,
      ...formData,
      courseName: selectedCourse.title,
      isActive: true,
      createdAt: editingAvailability ? editingAvailability.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (editingAvailability) {
      setAvailabilities(prev => prev.map(availability => 
        availability.id === editingAvailability.id ? availabilityData : availability
      ));
    } else {
      setAvailabilities(prev => [...prev, availabilityData]);
    }

    closeModal();
  };

  const handleDelete = (availabilityId: string) => {
    if (window.confirm('Are you sure you want to delete this availability?')) {
      setAvailabilities(prev => prev.filter(availability => availability.id !== availabilityId));
    }
  };

  const toggleAvailabilityStatus = (availabilityId: string) => {
    setAvailabilities(prev => prev.map(availability => 
      availability.id === availabilityId 
        ? { ...availability, isActive: !availability.isActive } 
        : availability
    ));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const getSelectedCourse = () => {
    return courses.find(c => c.id === formData.courseId);
  };

  const getTeacherCourses = () => {
    return courses.filter(course => course.isActive && course.teacherId === teacherId);
  };

  if (loading) {
    return (
      <Container>
        <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
          📅 Loading your availability...
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Teaching Availability</Title>
        <AddButton 
          onClick={() => {
            if (getTeacherCourses().length === 0) {
              alert('You need to create at least one active course before adding availability. Please go to the Courses tab to create a course first.');
              return;
            }
            openModal();
          }}
          disabled={getTeacherCourses().length === 0}
          style={{
            opacity: getTeacherCourses().length === 0 ? 0.6 : 1,
            cursor: getTeacherCourses().length === 0 ? 'not-allowed' : 'pointer'
          }}
        >
          📅 Add Availability
        </AddButton>
      </Header>

      <FilterControls>
        <FilterSelect
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Availabilities</option>
          <option value="active">Active Only</option>
          <option value="inactive">Inactive Only</option>
        </FilterSelect>
      </FilterControls>

      {filteredAvailabilities.length === 0 ? (
        <EmptyState>
          <div>📅 No availabilities found</div>
          <div style={{ marginTop: '1rem', fontSize: '0.875rem' }}>
            {getTeacherCourses().length === 0 
              ? 'You need to create at least one course before you can add availability. Please go to the Courses tab to create your first course.'
              : statusFilter !== 'all' 
                ? 'Try adjusting your filter or create a new availability.'
                : 'Create your first availability to start accepting bookings!'}
          </div>
        </EmptyState>
      ) : (
        <AvailabilityList>
          {filteredAvailabilities.map(availability => {
            const course = courses.find(c => c.id === availability.courseId);
            return (
              <AvailabilityCard key={availability.id} isActive={availability.isActive}>
                <AvailabilityHeader>
                  <AvailabilityInfo>
                    <DateTimeInfo>
                      <DateBadge>{formatDate(availability.date)}</DateBadge>
                      <TimeRange>{availability.startTime} - {availability.endTime}</TimeRange>
                    </DateTimeInfo>
                    <CourseTitle>{availability.courseName}</CourseTitle>
                    <CourseSkill>{course?.skillName}</CourseSkill>
                  </AvailabilityInfo>
                  <StatusBadge active={availability.isActive}>
                    {availability.isActive ? 'Active' : 'Inactive'}
                  </StatusBadge>
                </AvailabilityHeader>

                <AvailabilityDetails>
                  <DetailItem>
                    <DetailLabel>👥 Max Students</DetailLabel>
                    <DetailValue>{availability.maxStudents}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>💰 Cost</DetailLabel>
                    <DetailValue>${course?.cost}/session</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>⏱️ Duration</DetailLabel>
                    <DetailValue>{course?.duration} minutes</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>📍 Format</DetailLabel>
                    <DetailValue>{course?.format.replace('_', ' ')}</DetailValue>
                  </DetailItem>
                  {availability.location && (
                    <DetailItem>
                      <DetailLabel>🏢 Location</DetailLabel>
                      <DetailValue>{availability.location}</DetailValue>
                    </DetailItem>
                  )}
                  {availability.virtualMeetingUrl && (
                    <DetailItem>
                      <DetailLabel>💻 Meeting URL</DetailLabel>
                      <DetailValue>
                        <a href={availability.virtualMeetingUrl} target="_blank" rel="noopener noreferrer">
                          Join Meeting
                        </a>
                      </DetailValue>
                    </DetailItem>
                  )}
                </AvailabilityDetails>

                <AvailabilityActions>
                  <ActionButton variant="primary" onClick={() => openModal(availability)}>
                    ✏️ Edit
                  </ActionButton>
                  <ActionButton onClick={() => toggleAvailabilityStatus(availability.id)}>
                    {availability.isActive ? '🔓 Deactivate' : '🔒 Activate'}
                  </ActionButton>
                  <ActionButton variant="danger" onClick={() => handleDelete(availability.id)}>
                    🗑️ Delete
                  </ActionButton>
                </AvailabilityActions>
              </AvailabilityCard>
            );
          })}
        </AvailabilityList>
      )}

      {isModalOpen && (
        <Modal onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>
                {editingAvailability ? 'Edit Availability' : 'Add New Availability'}
              </ModalTitle>
              <CloseButton onClick={closeModal}>×</CloseButton>
            </ModalHeader>

            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </FormGroup>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <FormGroup>
                  <Label htmlFor="startTime">Start Time *</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => handleInputChange('startTime', e.target.value)}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="endTime">End Time *</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => handleInputChange('endTime', e.target.value)}
                    required
                  />
                </FormGroup>
              </div>

              <FormGroup>
                <Label htmlFor="courseId">Course *</Label>
                <Select
                  id="courseId"
                  value={formData.courseId}
                  onChange={(e) => handleInputChange('courseId', e.target.value)}
                  required
                  disabled={getTeacherCourses().length === 0}
                >
                  <option value="">
                    {getTeacherCourses().length === 0 
                      ? "No active courses available - create a course first" 
                      : "Select a course..."}
                  </option>
                  {getTeacherCourses().map(course => (
                    <option key={course.id} value={course.id}>
                      {course.title} - {course.skillName} (${course.cost}, {course.duration}min)
                    </option>
                  ))}
                </Select>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="maxStudents">Max Students *</Label>
                <Input
                  id="maxStudents"
                  type="number"
                  min="1"
                  max="20"
                  value={formData.maxStudents}
                  onChange={(e) => handleInputChange('maxStudents', Number(e.target.value))}
                  required
                />
              </FormGroup>

              {getSelectedCourse()?.format !== SessionFormat.ONLINE && (
                <FormGroup>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="e.g., 123 Main St, Studio A"
                  />
                </FormGroup>
              )}

              {getSelectedCourse()?.format !== SessionFormat.IN_PERSON && (
                <FormGroup>
                  <Label htmlFor="virtualMeetingUrl">Virtual Meeting URL</Label>
                  <Input
                    id="virtualMeetingUrl"
                    type="url"
                    value={formData.virtualMeetingUrl}
                    onChange={(e) => handleInputChange('virtualMeetingUrl', e.target.value)}
                    placeholder="e.g., https://meet.google.com/your-room"
                  />
                </FormGroup>
              )}

              <FormActions>
                <CancelButton type="button" onClick={closeModal}>
                  Cancel
                </CancelButton>
                <SubmitButton type="submit">
                  {editingAvailability ? 'Update Availability' : 'Create Availability'}
                </SubmitButton>
              </FormActions>
            </Form>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default TeacherAvailability;