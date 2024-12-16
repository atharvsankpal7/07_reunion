import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  startTime: {
    type: Date,
    required: [true, 'Start time is required']
  },
  endTime: {
    type: Date,
    required: [true, 'End time is required'],
    validate: {
      validator: function(this: any, v: Date) {
        return v > this.startTime;
      },
      message: 'End time must be after start time'
    }
  },
  priority: {
    type: Number,
    required: [true, 'Priority is required'],
    min: [1, 'Priority must be between 1 and 5'],
    max: [5, 'Priority must be between 1 and 5']
  },
  status: {
    type: String,
    enum: ['pending', 'finished'],
    default: 'pending'
  },
  actualEndTime: {
    type: Date
  }
}, {
  timestamps: true
});

const Task = mongoose.models.Task || mongoose.model('Task', taskSchema);

export default Task;