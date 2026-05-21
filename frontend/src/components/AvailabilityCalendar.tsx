import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const CalendarContainer = styled.div`
  background: #fff;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const MonthYear = styled.h3`
  margin: 0;
  color: #333;
`;

const NavButton = styled.button`
  background: none;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 0.5rem;
  cursor: pointer;
  
  &:hover {
    background: #f5f5f5;
  }
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background: #ddd;
`;

const CalendarDay = styled.div`
  background: white;
  padding: 0.5rem;
  min-height: 80px;
  position: relative;
  cursor: pointer;
  
  &:hover {
    background: #f9f9f9;
  }
  
  &.today {
    background: #e3f2fd;
  }
  
  &.other-month {
    color: #ccc;
  }
`;

const DayNumber = styled.div`
  font-weight: 500;
  margin-bottom: 0.25rem;
`;

const TimeSlot = styled.div`
  background: #007bff;
  color: white;
  font-size: 0.75rem;
  padding: 2px 4px;
  border-radius: 2px;
  margin-bottom: 2px;
  cursor: pointer;
  
  &:hover {
    background: #0056b3;
  }
`;

const TimeSlotList = styled.div`
  max-height: 200px;
  overflow-y: auto;
  margin-top: 1rem;
`;

const TimeSlotItem = styled.div`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 0.5rem;
  cursor: pointer;
  
  &:hover {
    background: #f5f5f5;
  }
  
  &.selected {
    background: #007bff;
    color: white;
  }
`;

interface AvailabilityCalendarProps {
  teacherId: string;
  onTimeSlotSelect: (date: string, time: string) => void;
  selectedSlot?: { date: string; time: string } | null;
  availabilities?: Array<{
    id: string;
    date: string;
    startTime: string;
    endTime: string;
    maxStudents: number;
    location?: string;
    virtualMeetingUrl?: string;
    isActive: boolean;
  }>;
}

const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({
  teacherId,
  onTimeSlotSelect,
  selectedSlot,
  availabilities = []
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);

  // Process real availability data
  const processedAvailability = React.useMemo(() => {
    const availabilityMap: { [key: string]: Array<{time: string, id: string, endTime: string}> } = {};
    
    // console.log('Processing availabilities:', availabilities);
    
    availabilities.forEach(availability => {
      if (availability.isActive) {
        // Parse date properly - availability.date comes as "YYYY-MM-DD"
        const date = new Date(availability.date + 'T00:00:00');
        const dateKey = date.toISOString().split('T')[0]; // Use ISO date format YYYY-MM-DD
        
        if (!availabilityMap[dateKey]) {
          availabilityMap[dateKey] = [];
        }
        
        // Format time from "HH:mm:ss" to "HH:mm"
        const startTime = availability.startTime.substring(0, 5);
        const endTime = availability.endTime.substring(0, 5);
        
        // Only add if not already present (deduplicate by time)
        const existingSlot = availabilityMap[dateKey].find(slot => slot.time === startTime);
        if (!existingSlot) {
          availabilityMap[dateKey].push({
            time: startTime,
            id: availability.id,
            endTime: endTime
          });
        }
      }
    });
    
    // console.log('Processed availability map:', availabilityMap);
    return availabilityMap;
  }, [availabilities]);

  useEffect(() => {
    if (selectedDate) {
      const dateKey = selectedDate.toISOString().split('T')[0]; // Use YYYY-MM-DD format
      const slots = processedAvailability[dateKey] || [];
      setAvailableSlots(slots.map(slot => slot.time));
      // console.log('Selected date:', dateKey, 'Available slots:', slots);
    }
  }, [selectedDate, processedAvailability]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Previous month days
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i);
      days.push({ date: prevDate, isCurrentMonth: false });
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = new Date(year, month, i);
      days.push({ date: currentDate, isCurrentMonth: true });
    }
    
    // Next month days to fill grid
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      const nextDate = new Date(year, month + 1, i);
      days.push({ date: nextDate, isCurrentMonth: false });
    }
    
    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return newDate;
    });
  };

  const handleDayClick = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day for comparison
    
    if (date >= today) {
      const dateKey = date.toISOString().split('T')[0];
      const hasAvailability = processedAvailability[dateKey] && processedAvailability[dateKey].length > 0;
      
      if (hasAvailability) {
        setSelectedDate(date);
        // console.log('Selected date with availability:', dateKey);
      } else {
        // console.log('No availability for date:', dateKey);
        // Optionally show a message to user that no slots are available
      }
    }
  };

  const handleTimeSlotClick = (time: string) => {
    if (selectedDate) {
      const dateString = selectedDate.toISOString().split('T')[0];
      onTimeSlotSelect(dateString, time);
    }
  };

  const days = getDaysInMonth(currentDate);
  const today = new Date().toDateString();

  return (
    <CalendarContainer>
      <CalendarHeader>
        <NavButton onClick={() => navigateMonth('prev')}>‹</NavButton>
        <MonthYear>
          {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </MonthYear>
        <NavButton onClick={() => navigateMonth('next')}>›</NavButton>
      </CalendarHeader>
      
      <CalendarGrid>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <CalendarDay key={day} style={{ fontWeight: 'bold', background: '#f5f5f5' }}>
            {day}
          </CalendarDay>
        ))}
        
        {days.map((day, index) => {
          const isToday = day.date.toDateString() === today;
          const dateKey = day.date.toISOString().split('T')[0];
          const hasAvailability = processedAvailability[dateKey] && processedAvailability[dateKey].length > 0;
          const todayOrFuture = day.date >= new Date(new Date().setHours(0, 0, 0, 0));
          
          return (
            <CalendarDay
              key={index}
              className={`${isToday ? 'today' : ''} ${!day.isCurrentMonth ? 'other-month' : ''}`}
              onClick={() => handleDayClick(day.date)}
              style={{
                cursor: hasAvailability && todayOrFuture ? 'pointer' : 'default',
                opacity: !day.isCurrentMonth ? 0.3 : 1
              }}
            >
              <DayNumber>{day.date.getDate()}</DayNumber>
              {hasAvailability && day.isCurrentMonth && todayOrFuture && (
                <TimeSlot>{processedAvailability[dateKey].length} slots</TimeSlot>
              )}
            </CalendarDay>
          );
        })}
      </CalendarGrid>
      
      {selectedDate && availableSlots.length > 0 && (
        <TimeSlotList>
          <h4>Available times for {selectedDate.toLocaleDateString()}</h4>
          {availableSlots.map((time, index) => (
            <TimeSlotItem
              key={`${time}-${index}`}
              className={selectedSlot?.date === selectedDate.toISOString().split('T')[0] && 
                        selectedSlot?.time === time ? 'selected' : ''}
              onClick={() => handleTimeSlotClick(time)}
            >
              {time}
            </TimeSlotItem>
          ))}
        </TimeSlotList>
      )}
    </CalendarContainer>
  );
};

export default AvailabilityCalendar;