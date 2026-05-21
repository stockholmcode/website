import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Course, Skill, SessionFormat, CourseCreateRequest, TeacherAvailability, AvailabilityCreateRequest, MultipleAvailabilityCreateRequest, AVAILABLE_SKILLS } from '../types/session';
import { coursesAPI } from '../services/api';

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
  background: #007bff;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
  
  &:hover {
    background: #0056b3;
  }
`;

const CourseGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const CourseCard = styled.div`
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const CourseImagePlaceholder = styled.div`
  height: 120px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.1rem;
  font-weight: 500;
`;

const CourseContent = styled.div`
  padding: 1.5rem;
`;

const CourseHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const CourseInfo = styled.div`
  flex: 1;
`;

const CourseTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 1.1rem;
`;

const CourseSkill = styled.div`
  color: #007bff;
  font-weight: 500;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
`;

const CourseDescription = styled.p`
  color: #666;
  font-size: 0.875rem;
  line-height: 1.4;
  margin: 0.5rem 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const CourseDetails = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  margin: 1rem 0;
  font-size: 0.875rem;
`;

const DetailItem = styled.div`
  color: #666;
`;

const DetailValue = styled.span`
  color: #333;
  font-weight: 500;
`;

const StatusBadge = styled.span<{ active: boolean }>`
  background: ${props => props.active ? '#d4edda' : '#f8d7da'};
  color: ${props => props.active ? '#155724' : '#721c24'};
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
`;

const AvailabilitySection = styled.div`
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
`;

const AvailabilityHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const AvailabilityTitle = styled.h4`
  margin: 0;
  color: #333;
  font-size: 0.95rem;
`;

const AddAvailabilityButton = styled.button`
  background: #28a745;
  color: white;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: background-color 0.2s;
  
  &:hover {
    background: #218838;
  }
`;

const AvailabilityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 200px;
  overflow-y: auto;
`;

const AvailabilityItem = styled.div<{ isActive: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: ${props => props.isActive ? '#f8f9fa' : '#fff3cd'};
  border: 1px solid ${props => props.isActive ? '#dee2e6' : '#ffeaa7'};
  border-radius: 4px;
  font-size: 0.85rem;
`;

const AvailabilityInfo = styled.div`
  flex: 1;
`;

const AvailabilityDate = styled.div`
  font-weight: 500;
  color: #333;
`;

const AvailabilityDetails = styled.div`
  color: #666;
  font-size: 0.8rem;
  margin-top: 0.2rem;
`;

const AvailabilityActions = styled.div`
  display: flex;
  gap: 0.25rem;
`;

const SmallActionButton = styled.button<{ variant?: 'danger' }>`
  padding: 0.25rem 0.5rem;
  border: none;
  border-radius: 3px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: background-color 0.2s;
  
  ${props => props.variant === 'danger' ? `
    background: #dc3545;
    color: white;
    &:hover { background: #c82333; }
  ` : `
    background: #6c757d;
    color: white;
    &:hover { background: #545b62; }
  `}
`;

const CourseActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const ActionButton = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  flex: 1;
  padding: 0.5rem;
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

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  
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

const ObjectivesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ObjectiveItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ObjectiveInput = styled.input`
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.875rem;
`;

const RemoveButton = styled.button`
  background: #dc3545;
  color: white;
  border: none;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.75rem;
  
  &:hover {
    background: #c82333;
  }
`;

const AddObjectiveButton = styled.button`
  background: #28a745;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  align-self: flex-start;
  
  &:hover {
    background: #218838;
  }
`;

const FormActions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
`;

const SubmitButton = styled.button`
  background: #007bff;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  
  &:hover {
    background: #0056b3;
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

const TimeSlotsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const TimeSlotItem = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr auto;
  gap: 0.5rem;
  align-items: end;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 6px;
  border: 1px solid #e9ecef;
`;

const TimeSlotLabel = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: #495057;
  margin-bottom: 0.25rem;
  display: block;
`;

const AddTimeSlotButton = styled.button`
  background: #17a2b8;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  align-self: flex-start;
  
  &:hover {
    background: #138496;
  }
`;

const RemoveTimeSlotButton = styled.button`
  background: #dc3545;
  color: white;
  border: none;
  padding: 0.25rem 0.5rem;
  border-radius: 3px;
  cursor: pointer;
  font-size: 0.75rem;
  
  &:hover {
    background: #c82333;
  }
`;

interface CourseManagementProps {
  teacherId: string;
}

type ModalType = 'course' | 'availability' | null;

const CourseManagement: React.FC<CourseManagementProps> = ({ teacherId }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [modalType, setModalType] = useState<ModalType>(null);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Course form state
  const [courseFormData, setCourseFormData] = useState<CourseCreateRequest>({
    title: '',
    description: '',
    skillName: '',
    cost: 0,
    duration: 60,
    format: SessionFormat.ONLINE,
    prerequisites: '',
    learningObjectives: ['']
  });

  // Multiple Availability form state
  const [multipleAvailabilityFormData, setMultipleAvailabilityFormData] = useState<MultipleAvailabilityCreateRequest>({
    courseId: '',
    maxStudents: 1,
    virtualMeetingUrl: '',
    location: '',
    timeSlots: [{ date: '', startTime: '09:00', endTime: '10:00' }]
  });

  // Load data from backend API
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      try {
        // Get skills (still using static list)
        const skills: Skill[] = AVAILABLE_SKILLS;
        
        // Get courses for this teacher from backend
        const teacherCourses = await coursesAPI.getCoursesByTeacher(teacherId);

        setSkills(skills);
        setCourses(teacherCourses);
      } catch (error) {
        console.error('Failed to load course data:', error);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [teacherId]);

  const resetCourseForm = () => {
    setCourseFormData({
      title: '',
      description: '',
      skillName: '',
      cost: 0,
      duration: 60,
      format: SessionFormat.ONLINE,
      prerequisites: '',
      learningObjectives: ['']
    });
    setEditingCourse(null);
  };

  const resetMultipleAvailabilityForm = () => {
    setMultipleAvailabilityFormData({
      courseId: '',
      maxStudents: 1,
      virtualMeetingUrl: '',
      location: '',
      timeSlots: [{ date: '', startTime: '09:00', endTime: '10:00' }]
    });
    setSelectedCourseId('');
  };

  const openCourseModal = (course?: Course) => {
    if (course) {
      setEditingCourse(course);
      setCourseFormData({
        title: course.title,
        description: course.description,
        skillName: course.skillName,
        cost: course.cost,
        duration: course.duration,
        format: course.format,
        prerequisites: course.prerequisites || '',
        learningObjectives: course.learningObjectives.length > 0 ? course.learningObjectives : ['']
      });
    } else {
      resetCourseForm();
    }
    setModalType('course');
  };

  const openAvailabilityModal = (courseId: string) => {
    resetMultipleAvailabilityForm();
    setSelectedCourseId(courseId);
    setMultipleAvailabilityFormData(prev => ({ ...prev, courseId }));
    setModalType('availability');
  };

  const closeModal = () => {
    setModalType(null);
    resetCourseForm();
    resetMultipleAvailabilityForm();
  };

  const handleCourseInputChange = (field: keyof CourseCreateRequest, value: any) => {
    setCourseFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMultipleAvailabilityInputChange = (field: keyof Omit<MultipleAvailabilityCreateRequest, 'timeSlots'>, value: any) => {
    setMultipleAvailabilityFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTimeSlotChange = (index: number, field: keyof MultipleAvailabilityCreateRequest['timeSlots'][0], value: string) => {
    setMultipleAvailabilityFormData(prev => ({
      ...prev,
      timeSlots: prev.timeSlots.map((slot, i) => 
        i === index ? { ...slot, [field]: value } : slot
      )
    }));
  };

  const addTimeSlot = () => {
    setMultipleAvailabilityFormData(prev => ({
      ...prev,
      timeSlots: [...prev.timeSlots, { date: '', startTime: '09:00', endTime: '10:00' }]
    }));
  };

  const removeTimeSlot = (index: number) => {
    setMultipleAvailabilityFormData(prev => ({
      ...prev,
      timeSlots: prev.timeSlots.length > 1 ? prev.timeSlots.filter((_, i) => i !== index) : prev.timeSlots
    }));
  };

  const handleCourseObjectiveChange = (index: number, value: string) => {
    const newObjectives = [...courseFormData.learningObjectives];
    newObjectives[index] = value;
    setCourseFormData(prev => ({ ...prev, learningObjectives: newObjectives }));
  };

  const addCourseObjective = () => {
    setCourseFormData(prev => ({
      ...prev,
      learningObjectives: [...prev.learningObjectives, '']
    }));
  };

  const removeCourseObjective = (index: number) => {
    const newObjectives = courseFormData.learningObjectives.filter((_, i) => i !== index);
    setCourseFormData(prev => ({
      ...prev,
      learningObjectives: newObjectives.length > 0 ? newObjectives : ['']
    }));
  };

  const handleCourseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filter out empty objectives
    const filteredObjectives = courseFormData.learningObjectives.filter(obj => obj.trim() !== '');
    
    const courseData = {
      title: courseFormData.title,
      description: courseFormData.description,
      skillName: courseFormData.skillName,
      cost: courseFormData.cost,
      duration: courseFormData.duration,
      format: courseFormData.format,
      prerequisites: courseFormData.prerequisites,
      learningObjectives: filteredObjectives.length > 0 ? filteredObjectives : [''],
    };

    try {
      // Debug: Check if JWT token exists
      const token = localStorage.getItem('authToken');
      console.log('JWT Token exists:', !!token);
      console.log('Token preview:', token ? token.substring(0, 50) + '...' : 'None');
      
      if (editingCourse) {
        await coursesAPI.updateCourse(editingCourse.id, courseData);
      } else {
        await coursesAPI.createCourse(courseData);
      }
      
      // Reload courses to get updated list
      const updatedCourses = await coursesAPI.getCoursesByTeacher(teacherId);
      setCourses(updatedCourses);
      
      closeModal();
    } catch (error: any) {
      console.error('Failed to save course:', error);
      console.error('Error details:', error.response?.data);
      console.error('Status code:', error.response?.status);
      alert('Failed to save course. Please try again.');
    }
  };

  const handleMultipleAvailabilitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!multipleAvailabilityFormData.courseId || multipleAvailabilityFormData.timeSlots.length === 0) return;

    const selectedCourse = courses.find(c => c.id === multipleAvailabilityFormData.courseId);
    if (!selectedCourse) return;

    // Filter out incomplete time slots
    const validTimeSlots = multipleAvailabilityFormData.timeSlots.filter(slot => 
      slot.date.trim() !== '' && slot.startTime.trim() !== '' && slot.endTime.trim() !== ''
    );

    if (validTimeSlots.length === 0) return;

    // Create multiple availability entries
    const newAvailabilities: TeacherAvailability[] = validTimeSlots.map((slot, index) => ({
      id: `${Date.now()}-${index}`,
      teacherId: teacherId,
      date: slot.date,
      startTime: slot.startTime,
      endTime: slot.endTime,
      courseId: multipleAvailabilityFormData.courseId,
      courseName: selectedCourse.title,
      maxStudents: multipleAvailabilityFormData.maxStudents,
      virtualMeetingUrl: multipleAvailabilityFormData.virtualMeetingUrl,
      location: multipleAvailabilityFormData.location,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));

    try {
      await coursesAPI.addMultipleAvailabilities(multipleAvailabilityFormData.courseId, {
        timeSlots: validTimeSlots,
        maxStudents: multipleAvailabilityFormData.maxStudents,
        virtualMeetingUrl: multipleAvailabilityFormData.virtualMeetingUrl,
        location: multipleAvailabilityFormData.location
      });
      
      // Reload courses to get updated list
      const updatedCourses = await coursesAPI.getCoursesByTeacher(teacherId);
      setCourses(updatedCourses);
      
      closeModal();
    } catch (error) {
      console.error('Failed to add availability:', error);
      alert('Failed to add availability. Please try again.');
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (window.confirm('Are you sure you want to delete this course? This will also delete all associated availability slots.')) {
      try {
        await coursesAPI.deleteCourse(courseId);
        
        // Reload courses to get updated list
        const updatedCourses = await coursesAPI.getCoursesByTeacher(teacherId);
        setCourses(updatedCourses);
      } catch (error) {
        console.error('Failed to delete course:', error);
        alert('Failed to delete course. Please try again.');
      }
    }
  };

  const toggleCourseStatus = async (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    if (course) {
      try {
        const updatedCourseData = {
          title: course.title,
          description: course.description,
          skillName: course.skillName,
          cost: course.cost,
          duration: course.duration,
          format: course.format,
          prerequisites: course.prerequisites,
          learningObjectives: course.learningObjectives,
          isActive: !course.isActive
        };
        
        await coursesAPI.updateCourse(courseId, updatedCourseData);
        
        // Reload courses to get updated list
        const updatedCourses = await coursesAPI.getCoursesByTeacher(teacherId);
        setCourses(updatedCourses);
      } catch (error) {
        console.error('Failed to toggle course status:', error);
        alert('Failed to update course status. Please try again.');
      }
    }
  };

  // Note: For now, we'll disable these availability management functions
  // as the backend doesn't have individual availability delete endpoints
  const handleDeleteAvailability = (courseId: string, availabilityId: string) => {
    alert('Individual availability deletion is not yet supported. Please recreate the course with new availability slots.');
  };

  const toggleAvailabilityStatus = (courseId: string, availabilityId: string) => {
    alert('Individual availability status toggle is not yet supported. Please recreate the course with new availability slots.');
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
    return courses.find(c => c.id === multipleAvailabilityFormData.courseId);
  };

  if (loading) {
    return (
      <Container>
        <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
          📚 Loading your courses...
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Course & Availability Management</Title>
        <AddButton onClick={() => openCourseModal()}>
          ➕ Add New Course
        </AddButton>
      </Header>

      {courses.length === 0 ? (
        <EmptyState>
          <div>📖 No courses created yet</div>
          <div style={{ marginTop: '1rem', fontSize: '0.875rem' }}>
            Create your first course to start teaching!
          </div>
        </EmptyState>
      ) : (
        <CourseGrid>
          {courses.map(course => (
            <CourseCard key={course.id}>
              <CourseImagePlaceholder>
                📚 {course.skillName}
              </CourseImagePlaceholder>
              
              <CourseContent>
                <CourseHeader>
                  <CourseInfo>
                    <CourseTitle>{course.title}</CourseTitle>
                    <CourseSkill>{course.skillName}</CourseSkill>
                    <CourseDescription>{course.description}</CourseDescription>
                  </CourseInfo>
                  <StatusBadge active={course.isActive}>
                    {course.isActive ? 'Active' : 'Inactive'}
                  </StatusBadge>
                </CourseHeader>
                
                <CourseDetails>
                  <DetailItem>💰 Cost: <DetailValue>${course.cost}/session</DetailValue></DetailItem>
                  <DetailItem>⏱️ Duration: <DetailValue>{course.duration}min</DetailValue></DetailItem>
                  <DetailItem>📍 Format: <DetailValue>{course.format.replace('_', ' ')}</DetailValue></DetailItem>
                </CourseDetails>

                <AvailabilitySection>
                  <AvailabilityHeader>
                    <AvailabilityTitle>📅 Available Sessions ({course.availabilities.length})</AvailabilityTitle>
                    <AddAvailabilityButton onClick={() => openAvailabilityModal(course.id)}>
                      + Add Time
                    </AddAvailabilityButton>
                  </AvailabilityHeader>

                  {course.availabilities.length === 0 ? (
                    <div style={{ 
                      textAlign: 'center', 
                      padding: '1rem', 
                      color: '#666', 
                      fontSize: '0.85rem',
                      fontStyle: 'italic'
                    }}>
                      No availability set - add your first time slot
                    </div>
                  ) : (
                    <AvailabilityList>
                      {course.availabilities.map(availability => (
                        <AvailabilityItem key={availability.id} isActive={availability.isActive}>
                          <AvailabilityInfo>
                            <AvailabilityDate>
                              {formatDate(availability.date)} • {availability.startTime} - {availability.endTime}
                            </AvailabilityDate>
                            <AvailabilityDetails>
                              👥 {availability.maxStudents} students
                              {availability.location && ` • 📍 ${availability.location}`}
                              {availability.virtualMeetingUrl && ` • 💻 Online`}
                            </AvailabilityDetails>
                          </AvailabilityInfo>
                          <AvailabilityActions>
                            <SmallActionButton 
                              onClick={() => toggleAvailabilityStatus(course.id, availability.id)}
                              title={availability.isActive ? 'Deactivate' : 'Activate'}
                            >
                              {availability.isActive ? '🔓' : '🔒'}
                            </SmallActionButton>
                            <SmallActionButton 
                              variant="danger"
                              onClick={() => handleDeleteAvailability(course.id, availability.id)}
                              title="Delete"
                            >
                              🗑️
                            </SmallActionButton>
                          </AvailabilityActions>
                        </AvailabilityItem>
                      ))}
                    </AvailabilityList>
                  )}
                </AvailabilitySection>

                <CourseActions>
                  <ActionButton variant="primary" onClick={() => openCourseModal(course)}>
                    ✏️ Edit
                  </ActionButton>
                  <ActionButton onClick={() => toggleCourseStatus(course.id)}>
                    {course.isActive ? '🔓 Deactivate' : '🔒 Activate'}
                  </ActionButton>
                  <ActionButton variant="danger" onClick={() => handleDeleteCourse(course.id)}>
                    🗑️ Delete
                  </ActionButton>
                </CourseActions>
              </CourseContent>
            </CourseCard>
          ))}
        </CourseGrid>
      )}

      {/* Course Modal */}
      {modalType === 'course' && (
        <Modal onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>
                {editingCourse ? 'Edit Course' : 'Create New Course'}
              </ModalTitle>
              <CloseButton onClick={closeModal}>×</CloseButton>
            </ModalHeader>

            <Form onSubmit={handleCourseSubmit}>
              <FormGroup>
                <Label htmlFor="title">Course Title *</Label>
                <Input
                  id="title"
                  type="text"
                  value={courseFormData.title}
                  onChange={(e) => handleCourseInputChange('title', e.target.value)}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="skillName">Skill *</Label>
                <Select
                  id="skillName"
                  value={courseFormData.skillName}
                  onChange={(e) => handleCourseInputChange('skillName', e.target.value)}
                  required
                >
                  <option value="">Select a skill...</option>
                  {skills.map(skill => (
                    <option key={skill.id} value={skill.name}>{skill.name}</option>
                  ))}
                </Select>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="description">Description *</Label>
                <TextArea
                  id="description"
                  value={courseFormData.description}
                  onChange={(e) => handleCourseInputChange('description', e.target.value)}
                  required
                />
              </FormGroup>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <FormGroup>
                  <Label htmlFor="cost">Cost per Session ($) *</Label>
                  <Input
                    id="cost"
                    type="number"
                    min="0"
                    value={courseFormData.cost}
                    onChange={(e) => handleCourseInputChange('cost', Number(e.target.value))}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="duration">Duration (minutes) *</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="15"
                    step="15"
                    value={courseFormData.duration}
                    onChange={(e) => handleCourseInputChange('duration', Number(e.target.value))}
                    required
                  />
                </FormGroup>
              </div>

              <FormGroup>
                <Label htmlFor="format">Format *</Label>
                <Select
                  id="format"
                  value={courseFormData.format}
                  onChange={(e) => handleCourseInputChange('format', e.target.value as SessionFormat)}
                  required
                >
                  <option value={SessionFormat.ONLINE}>Online</option>
                  <option value={SessionFormat.IN_PERSON}>In Person</option>
                  <option value={SessionFormat.HYBRID}>Hybrid</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="prerequisites">Prerequisites</Label>
                <Input
                  id="prerequisites"
                  type="text"
                  value={courseFormData.prerequisites}
                  onChange={(e) => handleCourseInputChange('prerequisites', e.target.value)}
                  placeholder="e.g., No experience required"
                />
              </FormGroup>

              <FormGroup>
                <Label>Learning Objectives</Label>
                <ObjectivesList>
                  {courseFormData.learningObjectives.map((objective, index) => (
                    <ObjectiveItem key={index}>
                      <ObjectiveInput
                        type="text"
                        value={objective}
                        onChange={(e) => handleCourseObjectiveChange(index, e.target.value)}
                        placeholder={`Objective ${index + 1}`}
                      />
                      {courseFormData.learningObjectives.length > 1 && (
                        <RemoveButton
                          type="button"
                          onClick={() => removeCourseObjective(index)}
                        >
                          Remove
                        </RemoveButton>
                      )}
                    </ObjectiveItem>
                  ))}
                  <AddObjectiveButton type="button" onClick={addCourseObjective}>
                    + Add Objective
                  </AddObjectiveButton>
                </ObjectivesList>
              </FormGroup>

              <FormActions>
                <CancelButton type="button" onClick={closeModal}>
                  Cancel
                </CancelButton>
                <SubmitButton type="submit">
                  {editingCourse ? 'Update Course' : 'Create Course'}
                </SubmitButton>
              </FormActions>
            </Form>
          </ModalContent>
        </Modal>
      )}

      {/* Multiple Availability Modal */}
      {modalType === 'availability' && (
        <Modal onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>
                Add Time Slots for "{getSelectedCourse()?.title}"
              </ModalTitle>
              <CloseButton onClick={closeModal}>×</CloseButton>
            </ModalHeader>

            <Form onSubmit={handleMultipleAvailabilitySubmit}>
              <FormGroup>
                <Label>Time Slots *</Label>
                <TimeSlotsList>
                  {multipleAvailabilityFormData.timeSlots.map((slot, index) => (
                    <TimeSlotItem key={index}>
                      <div>
                        <TimeSlotLabel>Date</TimeSlotLabel>
                        <Input
                          type="date"
                          value={slot.date}
                          onChange={(e) => handleTimeSlotChange(index, 'date', e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          required
                        />
                      </div>
                      <div>
                        <TimeSlotLabel>Start Time</TimeSlotLabel>
                        <Input
                          type="time"
                          value={slot.startTime}
                          onChange={(e) => handleTimeSlotChange(index, 'startTime', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <TimeSlotLabel>End Time</TimeSlotLabel>
                        <Input
                          type="time"
                          value={slot.endTime}
                          onChange={(e) => handleTimeSlotChange(index, 'endTime', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <RemoveTimeSlotButton
                          type="button"
                          onClick={() => removeTimeSlot(index)}
                          disabled={multipleAvailabilityFormData.timeSlots.length === 1}
                        >
                          Remove
                        </RemoveTimeSlotButton>
                      </div>
                    </TimeSlotItem>
                  ))}
                  <AddTimeSlotButton type="button" onClick={addTimeSlot}>
                    + Add Another Time Slot
                  </AddTimeSlotButton>
                </TimeSlotsList>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="maxStudents">Max Students *</Label>
                <Input
                  id="maxStudents"
                  type="number"
                  min="1"
                  max="20"
                  value={multipleAvailabilityFormData.maxStudents}
                  onChange={(e) => handleMultipleAvailabilityInputChange('maxStudents', Number(e.target.value))}
                  required
                />
              </FormGroup>

              {getSelectedCourse()?.format !== SessionFormat.ONLINE && (
                <FormGroup>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    type="text"
                    value={multipleAvailabilityFormData.location}
                    onChange={(e) => handleMultipleAvailabilityInputChange('location', e.target.value)}
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
                    value={multipleAvailabilityFormData.virtualMeetingUrl}
                    onChange={(e) => handleMultipleAvailabilityInputChange('virtualMeetingUrl', e.target.value)}
                    placeholder="e.g., https://meet.google.com/your-room"
                  />
                </FormGroup>
              )}

              <FormActions>
                <CancelButton type="button" onClick={closeModal}>
                  Cancel
                </CancelButton>
                <SubmitButton type="submit">
                  Add {multipleAvailabilityFormData.timeSlots.length} Time Slot{multipleAvailabilityFormData.timeSlots.length !== 1 ? 's' : ''}
                </SubmitButton>
              </FormActions>
            </Form>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default CourseManagement;