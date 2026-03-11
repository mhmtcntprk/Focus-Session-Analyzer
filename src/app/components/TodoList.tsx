import { useState } from 'react';
import { Plus, Trash2, Circle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export function TodoList() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', text: 'Design the timer component', completed: true },
    { id: '2', text: 'Implement ambient sounds', completed: false },
    { id: '3', text: 'Add theme switcher', completed: false },
  ]);
  const [inputValue, setInputValue] = useState('');

  const addTask = () => {
    if (inputValue.trim() === '') return;

    const newTask: Task = {
      id: Date.now().toString(),
      text: inputValue,
      completed: false,
    };

    setTasks([newTask, ...tasks]);
    setInputValue('');
  };

  const toggleTask = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-6">
      {/* Input Section */}
      <div className="flex gap-2 group/input">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="I need to..."
          className="flex-1 px-5 py-3.5 rounded-2xl bg-white/5 border border-white/10 focus:outline-none focus:border-indigo-400/50 focus:bg-white/10 transition-all placeholder:text-white/20 text-white font-light tracking-wide"
        />
        <motion.button
          onClick={addTask}
          className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20 transition-all duration-300 flex items-center justify-center"
          whileHover={{ scale: 1.05, rotate: 90 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus size={22} />
        </motion.button>
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {tasks.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              className="flex flex-col items-center justify-center pt-10 text-center text-sm font-light italic"
            >
              No active tasks. Time to focus.
            </motion.div>
          ) : (
            tasks.map((task, index) => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, x: -20, scale: 0.98 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                transition={{ type: "spring", stiffness: 400, damping: 30, delay: index * 0.05 }}
                className="group relative flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 overflow-hidden"
              >
                {/* Status Indicator */}
                <motion.button
                  onClick={() => toggleTask(task.id)}
                  className="relative z-10 flex-shrink-0"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.8 }}
                >
                  {task.completed ? (
                    <div className="text-emerald-400">
                      <CheckCircle2 size={22} />
                    </div>
                  ) : (
                    <div className="text-white/20 hover:text-white/50 transition-colors">
                      <Circle size={22} />
                    </div>
                  )}
                </motion.button>

                <motion.span
                  className="flex-1 text-[15px] font-light tracking-wide transition-all duration-500"
                  animate={{
                    opacity: task.completed ? 0.4 : 1,
                    textDecoration: task.completed ? 'line-through' : 'none',
                    x: task.completed ? 5 : 0,
                  }}
                >
                  {task.text}
                </motion.span>

                <motion.button
                  onClick={() => deleteTask(task.id)}
                  className="relative z-10 p-2 text-white/0 group-hover:text-rose-400/70 hover:text-rose-400 transition-all duration-300"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Trash2 size={18} />
                </motion.button>

                {/* Background Progress Highlight */}
                {task.completed && (
                  <motion.div 
                    layoutId={`bg-${task.id}`}
                    className="absolute inset-0 bg-emerald-500/5 pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  />
                )}
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Footer Info */}
      <div className="pt-4 border-t border-white/5 flex justify-between items-center text-[11px] uppercase tracking-[0.2em] font-medium text-white/30">
        <span>{tasks.filter(t => !t.completed).length} Tasks Pending</span>
        <button 
          onClick={() => setTasks(tasks.filter(t => !t.completed))}
          className="hover:text-white/60 transition-colors"
        >
          Clear Done
        </button>
      </div>
    </div>
  );
}
