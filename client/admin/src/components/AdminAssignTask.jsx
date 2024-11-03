import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Card,
  CardContent,
  CardActions,
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
  dateInput: {
    '& input': {
      padding: '10px',
      fontSize: '1rem',
    },
    '& .MuiInputBase-root': {
      height: '56px',
    },
  },
  deadlinePlaceholder: {
    color: '#aaa', // Placeholder color
  },
  taskCard: {
    marginBottom: '16px',
    transition: 'transform 0.2s, box-shadow 0.2s',
    '&:hover': {
      transform: 'scale(1.02)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
    },
  },
  filterButtons: {
    marginBottom: '16px',
    '& button': {
      marginRight: '10px',
      transition: 'background-color 0.2s',
      '&:hover': {
        backgroundColor: '#1976d2', // Primary color on hover
        color: '#fff',
      },
    },
  },
});

function AdminAssignTask() {
  const classes = useStyles();
  const [tasks, setTasks] = useState([]);
  const [taskDetails, setTaskDetails] = useState('');
  const [deadline, setDeadline] = useState('');
  const { projectCode } = useParams();
  const [projectAdmin, setProjectAdmin] = useState({ name: '', email: '' });
  const [filter, setFilter] = useState('Pending');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAndDecodeToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          if (decodedToken.adminId) {
            setProjectAdmin({
              name: `${decodedToken.firstname} ${decodedToken.lastname}`,
              email: decodedToken.email,
            });
          } else {
            navigate('/api/admin/login');
          }
        } catch (error) {
          console.error('Failed to decode token:', error);
          navigate('/api/admin/login');
        }
      } else {
        navigate('/api/admin/login');
      }
    };

    fetchAndDecodeToken();
    fetchTasks();
  }, [navigate, projectCode]);

  useEffect(() => {
    checkAndMarkMissedTasks();
  }, [Date.now(), tasks]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/admin/getTasks/${projectCode}`);
      setTasks(response.data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
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
          setTasks((prevTasks) =>
            prevTasks.map((t) =>
              t._id === task._id ? { ...t, status: 'Missed' } : t
            )
          );
        } catch (err) {
          console.error('Error updating task status:', err);
        }
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newTask = {
      projectCode,
      taskDetails,
      deadline,
    };
    try {
      const res = await axios.post('http://localhost:8000/api/admin/postTask', newTask);
      setTasks([...tasks, res.data.task]);
      setTaskDetails('');
      setDeadline('');
      window.location.reload(); // Reload tasks after adding a new one
    } catch (err) {
      console.log(err);
    }
  };

  const handleAcceptDeadline = async (taskId, requestedDeadline) => {
    try {
      await axios.put(`http://localhost:8000/api/admin/updateTaskDeadline/${taskId}`, {
        newDeadline: requestedDeadline,
      });
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? { ...task, deadline: requestedDeadline, requestStatus: 'No' } : task
        )
      );
    } catch (err) {
      console.error('Error accepting deadline:', err);
    }
  };

  const handleRejectDeadline = async (taskId) => {
    try {
      await axios.put(`http://localhost:8000/api/admin/rejectTaskDeadline/${taskId}`, {
        requestStatus: 'No',
      });
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? { ...task, requestStatus: 'No' } : task
        )
      );
    } catch (err) {
      console.error('Error rejecting deadline:', err);
    }
  };

  const filterTasks = () => {
    switch (filter) {
      case 'Pending':
        return tasks.filter((task) => task.status === 'Pending');
      case 'Missed':
        return tasks.filter((task) => task.status === 'Missed');
      case 'Completed':
        return tasks.filter((task) => task.status === 'Completed');
      default:
        return tasks;
    }
  };

  const filteredTasks = filterTasks();

  return (
    <Container maxWidth="md" className={classes.container}>
      <Typography variant="h4" gutterBottom fontFamily={"'Lexend Deca', sans-serif"}>
        Assign Task
      </Typography>

      <Paper elevation={3} style={{ padding: '16px', marginBottom: '16px' }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={8}>
                Task Details
              <TextField
                label="Task Details"
                fullWidth
                value={taskDetails}
                onChange={(e) => setTaskDetails(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
                Deadline
              <TextField
                type="date"
                fullWidth
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                required
                InputProps={{
                  className: classes.dateInput,
                }}
                InputLabelProps={{
                  className: classes.deadlinePlaceholder,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary" type="submit">
                Assign Task
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <div className={classes.filterButtons} fontFamily={"'Lexend Deca', sans-serif"}>
        <Button variant={filter === 'Pending' ? 'contained' : 'outlined'} onClick={() => setFilter('Pending')}>
          Pending
        </Button>
        <Button variant={filter === 'Missed' ? 'contained' : 'outlined'} onClick={() => setFilter('Missed')}>
          Missed
        </Button>
        <Button variant={filter === 'Completed' ? 'contained' : 'outlined'} onClick={() => setFilter('Completed')}>
          Completed
        </Button>
      </div>

      <Typography variant="h5" gutterBottom fontFamily={"'Lexend Deca', sans-serif"}>
        Tasks Overview
      </Typography>

      {filteredTasks.length > 0 ? (
        filteredTasks.map((task) => (
          <Card key={task._id} className={classes.taskCard}>
            <CardContent>
              <Typography variant="h6" fontFamily={"'Lexend Deca', sans-serif"}>{task.taskDetails}</Typography>
              <Typography color="textSecondary" fontFamily={"'Lexend Deca', sans-serif"}>Deadline: {task.deadline}</Typography>
              {task.requestStatus === 'Yes' && (
                <div>
                  <p fontFamily={"'Lexend Deca', sans-serif"}>Requested Deadline: {task.requestedDeadline}</p>
                </div>
              )}
            </CardContent>
            <CardActions>
              {task.requestStatus === 'Yes' && (
                <>
                  <Button size="small" onClick={() => handleAcceptDeadline(task._id, task.requestedDeadline)}>
                    Accept
                  </Button>
                  <Button size="small" onClick={() => handleRejectDeadline(task._id)}>
                    Reject
                  </Button>
                </>
              )}
            </CardActions>
          </Card>
        ))
      ) : (
        <Typography fontFamily={"'Lexend Deca', sans-serif"}>No tasks available</Typography>
      )}
    </Container>
  );
}

export default AdminAssignTask;
