import React, { useState, useEffect } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useAuth } from '../contexts/AuthContext'
import axios from 'axios'
import TaskForm from './TaskForm'
import './Dashboard.css'

// Función para traducir prioridades
const getPriorityLabel = (priority) => {
  const priorityMap = {
    'low': 'Baja',
    'medium': 'Media',
    'high': 'Alta'
  }
  return priorityMap[priority] || 'Media'
}

// Función para obtener el color de la prioridad
const getPriorityColor = (priority) => {
  const colorMap = {
    'low': '#10b981', // Verde
    'medium': '#f59e0b', // Amarillo
    'high': '#ef4444' // Rojo
  }
  return colorMap[priority] || '#f59e0b'
}

// Componente para tareas arrastrables
const SortableTask = ({ task, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id.toString() })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const priorityLabel = getPriorityLabel(task.priority)
  const priorityColor = getPriorityColor(task.priority)

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`task-item ${isDragging ? 'dragging' : ''}`}
      {...attributes}
      {...listeners}
    >
      <div className="task-title">{task.title}</div>
      {task.description && (
        <div className="task-description">{task.description}</div>
      )}
      <div className="task-priority" style={{ color: priorityColor }}>
        Prioridad: {priorityLabel}
      </div>
      <div className="task-actions">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onEdit(task)
          }}
          className="btn-edit"
        >
          Editar
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete(task.id)
          }}
          className="btn-delete"
        >
          Eliminar
        </button>
      </div>
    </div>
  )
}

// Componente para columnas droppable
const DroppableColumn = ({ column, tasks, onEdit, onDelete }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  })

  return (
    <div className={`column ${isOver ? 'column-over' : ''}`} >
      <div className="column-header">
        <span className="column-title">{column.title}</span>
        <span className="task-count">{tasks.length}</span>
      </div>
      
      <div 
        ref={setNodeRef}
        className={`task-list ${isOver ? 'task-list-over' : ''}`}
      >
        <SortableContext
          items={tasks.map(task => task.id.toString())}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <SortableTask
              key={task.id.toString()}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </SortableContext>
        {isOver && tasks.length === 0 && (
          <div className="drop-indicator">
            Suelta aquí para mover la tarea
          </div>
        )}
      </div>
    </div>
  )
}

const Dashboard = () => {
  const { user, logout } = useAuth()
  const [loading, setLoading] = useState(true)
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [error, setError] = useState('')

  // Estados para las columnas tipo Trello
  const [boardData, setBoardData] = useState({
    todo: {
      id: 'todo',
      title: 'Por Hacer',
      tasks: []
    },
    inProgress: {
      id: 'inProgress',
      title: 'En Progreso',
      tasks: []
    },
    done: {
      id: 'done',
      title: 'Completado',
      tasks: []
    }
  })

  // Configurar sensores para drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      setLoading(true)
      setError('')
      
      const response = await axios.get('/api/tasks')
      
      if (response.data.success) {
        const tasks = response.data.data
        organizeTasksIntoColumns(tasks)
      } else {
        setError('Error al cargar las tareas')
      }
    } catch (error) {
      console.error('Error fetching tasks:', error)
      setError('Error al cargar las tareas')
    } finally {
      setLoading(false)
    }
  }

  const organizeTasksIntoColumns = (taskList) => {
    const newBoardData = {
      todo: { id: 'todo', title: 'Por Hacer', tasks: [] },
      inProgress: { id: 'inProgress', title: 'En Progreso', tasks: [] },
      done: { id: 'done', title: 'Completado', tasks: [] }
    }
    
    taskList.forEach(task => {
      const status = task.status || 'todo'
      if (newBoardData[status]) {
        newBoardData[status].tasks.push(task)
      }
    })
    
    setBoardData(newBoardData)
  }

  const handleDragEnd = async (event) => {
    const { active, over } = event

    if (!over) return

    const activeId = active.id.toString()
    const overId = over.id.toString()

    // Si se arrastra sobre la misma tarea, no hacer nada
    if (activeId === overId) return

    // Encontrar la columna que contiene la tarea activa
    let sourceColumnId = null
    let sourceTask = null

    Object.keys(boardData).forEach(columnId => {
      const taskIndex = boardData[columnId].tasks.findIndex(
        task => task.id.toString() === activeId
      )
      if (taskIndex !== -1) {
        sourceColumnId = columnId
        sourceTask = boardData[columnId].tasks[taskIndex]
      }
    })

    if (!sourceColumnId || !sourceTask) return

    // Determinar la columna de destino
    let destColumnId = null
    let destTaskIndex = -1

    // Si se arrastra sobre una columna
    if (overId === 'todo' || overId === 'inProgress' || overId === 'done') {
      destColumnId = overId
      destTaskIndex = boardData[overId].tasks.length // Al final de la columna
    } else {
      // Si se arrastra sobre otra tarea, usar su columna
      Object.keys(boardData).forEach(columnId => {
        const taskIndex = boardData[columnId].tasks.findIndex(
          task => task.id.toString() === overId
        )
        if (taskIndex !== -1) {
          destColumnId = columnId
          destTaskIndex = taskIndex
        }
      })
    }

    if (!destColumnId) return

    // Si es la misma columna, reordenar
    if (sourceColumnId === destColumnId) {
      const column = boardData[sourceColumnId]
      const oldIndex = column.tasks.findIndex(task => task.id.toString() === activeId)
      
      if (oldIndex !== -1 && destTaskIndex !== -1 && oldIndex !== destTaskIndex) {
        const newTasks = arrayMove(column.tasks, oldIndex, destTaskIndex)

        setBoardData(prev => ({
          ...prev,
          [sourceColumnId]: {
            ...prev[sourceColumnId],
            tasks: newTasks
          }
        }))

        console.log(`Tarea reordenada en columna ${sourceColumnId}: de posición ${oldIndex} a ${destTaskIndex}`)
      }
    } else {
      // Mover entre columnas
      const sourceColumn = boardData[sourceColumnId]
      const destColumn = boardData[destColumnId]

      // Remover de la columna origen
      const sourceTasks = sourceColumn.tasks.filter(
        task => task.id.toString() !== activeId
      )

      // Actualizar la tarea
      const updatedTask = {
        ...sourceTask,
        status: destColumnId,
        completed: destColumnId === 'done'
      }

      // Insertar en la posición correcta en la columna destino
      const destTasks = [...destColumn.tasks]
      const insertIndex = destTaskIndex !== -1 ? destTaskIndex : destTasks.length
      destTasks.splice(insertIndex, 0, updatedTask)

      // Actualizar el estado local
      setBoardData(prev => ({
        ...prev,
        [sourceColumnId]: {
          ...prev[sourceColumnId],
          tasks: sourceTasks
        },
        [destColumnId]: {
          ...prev[destColumnId],
          tasks: destTasks
        }
      }))

      // Actualizar en la base de datos
      try {
        await axios.patch(`/api/tasks/${activeId}/status`, {
          status: destColumnId
        })
        console.log(`Tarea ${activeId} movida de ${sourceColumnId} a ${destColumnId}`)
      } catch (error) {
        console.error('Error actualizando status de tarea:', error)
        // Si falla, recargar las tareas para mantener consistencia
        fetchTasks()
      }
    }
  }

  const addTask = async (taskData) => {
    try {
      setError('')
      
      console.log('Dashboard - Intentando crear tarea:', taskData)
      console.log('Dashboard - Token actual:', axios.defaults.headers.common['Authorization'])
      
      const response = await axios.post('/api/tasks', taskData)
      
      if (response.data.success) {
        const newTask = response.data.data
        
        setBoardData(prev => ({
          ...prev,
          todo: {
            ...prev.todo,
            tasks: [...prev.todo.tasks, newTask]
          }
        }))
        
        setShowTaskForm(false)
      } else {
        setError(response.data.message || 'Error al crear la tarea')
      }
    } catch (error) {
      console.error('Error adding task:', error)
      console.error('Error response:', error.response?.data)
      setError(error.response?.data?.message || 'Error al crear la tarea')
    }
  }

  const updateTask = async (taskId, updates) => {
    try {
      setError('')
      
      const response = await axios.put(`/api/tasks/${taskId}`, updates)
      
      if (response.data.success) {
        const updatedTask = response.data.data
        
        setBoardData(prev => {
          const newBoardData = { ...prev }
          Object.keys(newBoardData).forEach(columnId => {
            newBoardData[columnId].tasks = newBoardData[columnId].tasks.map(task =>
              task.id === taskId ? updatedTask : task
            )
          })
          return newBoardData
        })
        
        setEditingTask(null)
      } else {
        setError(response.data.message || 'Error al actualizar la tarea')
      }
    } catch (error) {
      console.error('Error updating task:', error)
      setError(error.response?.data?.message || 'Error al actualizar la tarea')
    }
  }

  const deleteTask = async (taskId) => {
    try {
      setError('')
      
      const response = await axios.delete(`/api/tasks/${taskId}`)
      
      if (response.data.success) {
        setBoardData(prev => {
          const newBoardData = { ...prev }
          Object.keys(newBoardData).forEach(columnId => {
            newBoardData[columnId].tasks = newBoardData[columnId].tasks.filter(
              task => task.id !== taskId
            )
          })
          return newBoardData
        })
      } else {
        setError(response.data.message || 'Error al eliminar la tarea')
      }
    } catch (error) {
      console.error('Error deleting task:', error)
      setError(error.response?.data?.message || 'Error al eliminar la tarea')
    }
  }

  const handleLogout = () => {
    logout()
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando tareas...</p>
      </div>
    )
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Panel de Tareas</h1>
          <div className="user-info">
            <span>Hola, {user?.name || 'Usuario'}</span>
            <button onClick={handleLogout} className="btn btn-secondary">
              Cerrar Sesión
            </button>
          </div>
        </div>
        <button 
          onClick={() => setShowTaskForm(true)} 
          className="btn btn-primary add-task-btn"
        >
          + Nueva Tarea
        </button>
      </header>

      {error && (
        <div className="error-banner">
          {error}
          <button onClick={() => setError('')} className="error-close">×</button>
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="board-container">
          {Object.values(boardData).map(column => (
            <DroppableColumn
              key={column.id}
              column={column}
              tasks={column.tasks}
              onEdit={setEditingTask}
              onDelete={deleteTask}
            />
          ))}
        </div>
      </DndContext>

      {showTaskForm && (
        <TaskForm
          onSubmit={addTask}
          onCancel={() => setShowTaskForm(false)}
        />
      )}

      {editingTask && (
        <TaskForm
          task={editingTask}
          onSubmit={(updates) => updateTask(editingTask.id, updates)}
          onCancel={() => setEditingTask(null)}
        />
      )}
    </div>
  )
}

export default Dashboard 