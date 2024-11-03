import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Paper,
  Grid
} from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  container: {
    fontFamily: 'Lexend Deca, sans-serif',
    backgroundColor: '#f5f5f5', // Light gray background
    padding: '20px',
    borderRadius: '8px',
    minHeight: '100vh', // Ensures the container takes up full height
  },
  taskCard: {
    marginBottom: '16px',
    transition: 'transform 0.2s, box-shadow 0.2s',
    '&:hover': {
      transform: 'scale(1.02)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
    },
  },
});

function InvestigatorTasks() {
  const classes = useStyles();
  const [tasks, setTasks] = useState([]);
  const [newDeadline, setNewDeadline] = useState('');
  const [requestingDeadline, setRequestingDeadline] = useState(null); // Store the task ID being requested for deadline change
  const { projectCode } = useParams();

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/admin/getTasks/${projectCode}`);
      setTasks(response.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  const checkAndMarkMissedTasks = async () => {
    const currentDate = new Date();
    for (let task of tasks) {
      const taskDeadline = new Date(task.deadline);
      if (task.status === 'Pending' && currentDate > taskDeadline) {
        try {
          await axios.put(`http://localhost:8000/api/admin/updateTaskStatus/${task._id}`, {
            status: 'Missed',
          });
          setTasks(prevTasks =>
            prevTasks.map(t =>
              t._id === task._id ? { ...t, status: 'Missed' } : t
            )
          );
        } catch (err) {
          console.error("Error updating task status:", err);
        }
      }
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [projectCode]);

  useEffect(() => {
    checkAndMarkMissedTasks();
  }, [tasks]);

  const markTaskAsCompleted = async (taskId) => {
    try {
      await axios.put(`http://localhost:8000/api/admin/updateTaskStatus/${taskId}`, {
        status: 'Completed',
      });
      setTasks(prevTasks =>
        prevTasks.map(t =>
          t._id === taskId ? { ...t, status: 'Completed' } : t
        )
      );
    } catch (err) {
      console.error("Error marking task as completed:", err);
    }
  };

  const handleDeadlineRequest = async (taskId) => {
    try {
      await axios.put(`http://localhost:8000/api/investigator/requestTaskDeadline/${taskId}`, {
        requestedDeadline: newDeadline,
        requestStatus: 'Yes',
      });
      // Optionally update state to reflect the request
      setTasks(prevTasks =>
        prevTasks.map(t =>
          t._id === taskId ? { ...t, requestedDeadline: newDeadline, requestStatus: 'yes' } : t
        )
      );
      // Reset state after the request
      setNewDeadline('');
      setRequestingDeadline(null);
    } catch (err) {
      console.error("Error requesting new deadline:", err);
    }
  };

  const pendingTasks = tasks.filter(task => task.status === 'Pending');
  const missedTasks = tasks.filter(task => task.status === 'Missed');
  const completedTasks = tasks.filter(task => task.status === 'Completed');

  return (
    <Container maxWidth="md" className={classes.container}>
      <Typography variant="h4" gutterBottom fontFamily={"'Lexend Deca', sans-serif"}>
        My Tasks
      </Typography>

      <Paper elevation={3} style={{ padding: '16px', marginBottom: '16px' }}>
        <Typography variant="h5" gutterBottom fontFamily={"'Lexend Deca', sans-serif"}>
          Pending Tasks
        </Typography>
        {pendingTasks.length > 0 ? (
          pendingTasks.map((task) => (
            <Card key={task._id} className={classes.taskCard}>
              <CardContent>
                <Typography variant="h6" fontFamily={"'Lexend Deca', sans-serif"}>{task.taskDetails}</Typography>
                <Typography color="textSecondary" fontFamily={"'Lexend Deca', sans-serif"}>Deadline: {task.deadline}</Typography>
                {task.requestStatus === 'Yes' && (
                  <Typography color="textSecondary" fontFamily={"'Lexend Deca', sans-serif"}>Requested Deadline: {task.requestedDeadline}</Typography>
                )}
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => markTaskAsCompleted(task._id)}>
                  Mark as Completed
                </Button>
                <Button size="small" onClick={() => {
                  setRequestingDeadline(task._id);
                  setNewDeadline('');
                }}>
                  Request New Deadline
                </Button>
                {requestingDeadline === task._id && (
                  <div>
                    <input
                      type="date"
                      value={newDeadline}
                      onChange={(e) => setNewDeadline(e.target.value)}
                      required
                    />
                    <Button size="small" onClick={() => handleDeadlineRequest(task._id)}>
                      Send Request
                    </Button>
                  </div>
                )}
              </CardActions>
            </Card>
          ))
        ) : (
          <Typography fontFamily={"'Lexend Deca', sans-serif"}>No pending tasks available.</Typography>
        )}
      </Paper>

      <Paper elevation={3} style={{ padding: '16px', marginBottom: '16px' }}>
        <Typography variant="h5" gutterBottom fontFamily={"'Lexend Deca', sans-serif"}>
          Missed Tasks
        </Typography>
        {missedTasks.length > 0 ? (
          missedTasks.map((task) => (
            <Card key={task._id} className={classes.taskCard}>
              <CardContent>
                <Typography variant="h6" fontFamily={"'Lexend Deca', sans-serif"}>{task.taskDetails}</Typography>
                <Typography color="textSecondary" fontFamily={"'Lexend Deca', sans-serif"}>Deadline: {task.deadline}</Typography>
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography fontFamily={"'Lexend Deca', sans-serif"}>No missed tasks available.</Typography>
        )}
      </Paper>

      <Paper elevation={3} style={{ padding: '16px', marginBottom: '16px' }}>
        <Typography variant="h5" gutterBottom fontFamily={"'Lexend Deca', sans-serif"}>
          Completed Tasks
        </Typography>
        {completedTasks.length > 0 ? (
          completedTasks.map((task) => (
            <Card key={task._id} className={classes.taskCard}>
              <CardContent>
                <Typography variant="h6" fontFamily={"'Lexend Deca', sans-serif"}>{task.taskDetails}</Typography>
                <Typography color="textSecondary" fontFamily={"'Lexend Deca', sans-serif"}>Deadline: {task.deadline}</Typography>
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography fontFamily={"'Lexend Deca', sans-serif"}>No completed tasks available.</Typography>
        )}
      </Paper>
    </Container>
  );
}

export default InvestigatorTasks;
