/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Check,
  Copy,
  CheckCircle2,
  ListTodo,
  Search,
  X,
  TrendingUp,
  GraduationCap,
  Calendar,
  Code2,
  BookOpen,
  CheckSquare
} from 'lucide-react';

type Priority = 'Baja' | 'Media' | 'Alta';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  dueDate: string;
  priority: Priority;
}

export default function App() {
  const [activeScreen, setActiveScreen] = useState<'agenda' | 'code' | 'guide'>('agenda');
  
  const todayStr = new Date().toISOString().split('T')[0];

  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Lectura de Tesis Doctoral - Cap. 2', completed: true, createdAt: '09:00 AM', dueDate: todayStr, priority: 'Alta' },
    { id: '2', title: 'Preparar seminario de Matemáticas', completed: false, createdAt: '10:30 AM', dueDate: todayStr, priority: 'Media' },
    { id: '3', title: 'Revisar bibliografía de investigación', completed: false, createdAt: '11:15 AM', dueDate: todayStr, priority: 'Baja' }
  ]);
  const [inputText, setInputText] = useState('');
  const [inputDate, setInputDate] = useState(todayStr);
  const [inputPriority, setInputPriority] = useState<Priority>('Media');
  const [searchQuery, setSearchQuery] = useState('');
  const [inputError, setInputError] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const addTask = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) {
      setInputError('Por favor, escribe una actividad académica.');
      return;
    }
    setInputError(null);
    const newTask: Task = {
      id: Date.now().toString(),
      title: inputText.trim(),
      completed: false,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      dueDate: inputDate || todayStr,
      priority: inputPriority
    };
    setTasks([newTask, ...tasks]);
    setInputText('');
    setInputDate(todayStr);
    setInputPriority('Media');
    showToast('Actividad agregada con éxito');
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
    showToast('Actividad eliminada');
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(label);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getPriorityBadgeColor = (priority: Priority) => {
    switch (priority) {
      case 'Alta':
        return 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-700/50';
      case 'Media':
        return 'bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-700/50';
      case 'Baja':
        return 'bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
    }
  };

  // Progress calculation
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const progressPercentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  // Filtered tasks based on real-time search query
  const filteredTasks = tasks.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  const kotlinCodeMain = `package com.example.miagenda

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.miagenda.ui.theme.MiAgendaTheme
import java.time.LocalDate

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MiAgendaTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    AgendaScreen()
                }
            }
        }
    }
}

enum class Priority { Alta, Media, Baja }

data class Task(
    val id: String,
    val title: String,
    var completed: Boolean,
    val dueDate: String,
    val priority: Priority
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AgendaScreen() {
    val taskList = remember { mutableStateListOf<Task>() }
    var textInput by remember { mutableStateOf("") }
    var dateInput by remember { mutableStateOf(LocalDate.now().toString()) }
    var priorityInput by remember { mutableStateOf(Priority.Media) }
    var searchQuery by remember { mutableStateOf("") }
    var showError by remember { mutableStateOf(false) }

    val totalCount = taskList.size
    val completedCount = taskList.count { it.completed }
    val progress = if (totalCount == 0) 0f else completedCount.toFloat() / totalCount.toFloat()

    val filteredList = taskList.filter { 
        it.title.contains(searchQuery, ignoreCase = true) 
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Mi Agenda Académica") },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = Color(0xFF1E3A8A),
                    titleContentColor = Color(0xFFF59E0B)
                )
            )
        }
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Contenido de la app ...
        }
    }
}`;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center font-sans selection:bg-amber-500 selection:text-blue-950 p-0 sm:py-6">
      {/* Top Notification Toast */}
      {toastMessage && (
        <div className="fixed top-4 z-50 bg-blue-950 border border-amber-500/50 text-amber-300 px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs font-medium animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Mobile-First Phone Container */}
      <div className="w-full sm:max-w-[420px] h-screen sm:h-[840px] bg-slate-900 sm:rounded-[40px] sm:border-[10px] sm:border-slate-800 shadow-2xl flex flex-col overflow-hidden relative">
        
        {/* Mobile Status Bar */}
        <div className="bg-[#1E3A8A] text-white px-6 pt-3 pb-1 flex justify-between items-center text-[11px] font-mono shrink-0">
          <span>09:41</span>
          <div className="flex items-center gap-1.5 text-amber-300">
            <span>5G</span>
            <div className="w-4 h-2.5 border border-amber-300 rounded-sm p-0.5 flex items-center">
              <div className="w-full h-full bg-amber-300 rounded-2xs"></div>
            </div>
          </div>
        </div>

        {/* Academic App Top Bar */}
        <div className="px-5 py-3.5 bg-[#1E3A8A] text-white flex items-center justify-between shadow-md shrink-0 border-b border-amber-500/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-blue-950 font-bold shadow">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-serif font-bold text-sm tracking-tight text-white">Mi Agenda Académica</h1>
              <p className="text-[10px] text-amber-300">Jetpack Compose Kotlin</p>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">
            v1.0
          </span>
        </div>

        {/* Main Screen Body */}
        <div className="flex-1 overflow-y-auto bg-slate-900 p-4 flex flex-col gap-3.5 pb-20">
          {activeScreen === 'agenda' && (
            <>
              {/* Input Form */}
              <form onSubmit={addTask} className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800 space-y-3 shadow-sm">
                <div>
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => {
                      setInputText(e.target.value);
                      if (inputError) setInputError(null);
                    }}
                    placeholder="Escribe una actividad académica..."
                    className={`w-full px-3.5 py-2.5 text-xs rounded-xl border outline-none transition-all ${
                      inputError
                        ? 'border-rose-500 focus:border-rose-500'
                        : 'border-slate-800 bg-slate-900 text-white placeholder-slate-500 focus:border-amber-500'
                    }`}
                  />
                  {inputError && (
                    <p className="text-[11px] text-rose-500 font-medium mt-1 pl-1">
                      {inputError}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 items-center">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1 font-medium flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-amber-400" />
                      <span>Fecha límite</span>
                    </label>
                    <input
                      type="date"
                      value={inputDate}
                      onChange={(e) => setInputDate(e.target.value)}
                      className="w-full px-2.5 py-2 text-xs rounded-xl border border-slate-800 bg-slate-900 text-white focus:border-amber-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1 font-medium">Prioridad</label>
                    <div className="flex bg-slate-800 p-0.5 rounded-xl text-[11px] font-medium">
                      {(['Baja', 'Media', 'Alta'] as Priority[]).map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setInputPriority(p)}
                          className={`flex-1 py-1.5 rounded-lg transition-all ${
                            inputPriority === p
                              ? 'bg-[#1E3A8A] text-amber-300 shadow-xs font-bold border border-amber-500/30'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#1E3A8A] hover:bg-blue-900 text-amber-300 text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 border border-amber-500/30"
                >
                  <Plus className="w-4 h-4" />
                  <span>Agregar Actividad</span>
                </button>
              </form>

              {/* Summary Progress Card */}
              <div className="p-3.5 rounded-2xl bg-blue-950/40 border border-blue-900/60 space-y-2 shadow-sm">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="flex items-center gap-1.5 text-blue-200">
                    <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                    <span>Progreso Académico</span>
                  </span>
                  <span className="text-amber-400 font-bold">
                    {progressPercentage}% <span className="text-[10px] font-normal text-slate-400">({completedTasks}/{totalTasks})</span>
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-500 h-full transition-all duration-300 rounded-full"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar actividad académica..."
                  className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-slate-800 bg-slate-950 text-white placeholder-slate-500 focus:border-amber-500 outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Task List */}
              <div className="flex-1 space-y-2.5 overflow-y-auto pr-0.5">
                {filteredTasks.length === 0 ? (
                  <div className="h-40 flex flex-col items-center justify-center text-center p-4 text-slate-500">
                    <ListTodo className="w-9 h-9 mb-2 opacity-40 text-amber-400" />
                    <p className="text-xs">
                      {searchQuery ? 'No se encontraron actividades con ese nombre' : 'No hay actividades pendientes. ¡Agrega una nueva arriba!'}
                    </p>
                  </div>
                ) : (
                  filteredTasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/80 flex items-center justify-between gap-3 shadow-sm transition-all"
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <button
                          type="button"
                          onClick={() => toggleTask(task.id)}
                          className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors shrink-0 ${
                            task.completed
                              ? 'bg-[#1E3A8A] border-amber-500 text-amber-300'
                              : 'border-slate-700 bg-slate-900'
                          }`}
                        >
                          {task.completed && <Check className="w-3.5 h-3.5" />}
                        </button>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p
                              className={`text-xs font-semibold truncate ${
                                task.completed
                                  ? 'line-through text-slate-500'
                                  : 'text-white'
                              }`}
                            >
                              {task.title}
                            </p>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-md border font-medium ${getPriorityBadgeColor(task.priority)}`}>
                              {task.priority}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                            <span>📅 {task.dueDate}</span>
                            <span>·</span>
                            <span>{task.createdAt}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => deleteTask(task.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors rounded-lg hover:bg-rose-950/30 shrink-0"
                        title="Eliminar actividad"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </>
          )}

          {activeScreen === 'code' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Código Kotlin (MainActivity.kt)</h2>
                <button
                  onClick={() => copyToClipboard(kotlinCodeMain, 'code')}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-blue-950 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow"
                >
                  {copiedCode === 'code' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode === 'code' ? 'Copiado' : 'Copiar'}</span>
                </button>
              </div>
              <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 overflow-x-auto max-h-[500px]">
                <pre className="text-[11px] font-mono text-slate-200 leading-relaxed">
                  <code>{kotlinCodeMain}</code>
                </pre>
              </div>
            </div>
          )}

          {activeScreen === 'guide' && (
            <div className="space-y-4 animate-fadeIn text-xs text-slate-300 leading-relaxed">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <h3 className="font-bold text-amber-400 text-sm">Guía de Jetpack Compose</h3>
                <p>
                  Esta aplicación está diseñada siguiendo los principios de Jetpack Compose para Android:
                </p>
                <ul className="list-disc pl-4 space-y-1 text-slate-400">
                  <li><strong>Scaffold & TopAppBar:</strong> Estructura visual de Material 3.</li>
                  <li><strong>LazyColumn:</strong> Renderizado eficiente de la lista de tareas.</li>
                  <li><strong>mutableStateListOf:</strong> Reactividad automática en tiempo real.</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Bottom Navigation Bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-blue-950/95 backdrop-blur-md border-t border-amber-500/20 px-6 py-2.5 flex items-center justify-around z-30 shadow-2xl">
          <button
            onClick={() => setActiveScreen('agenda')}
            className={`flex flex-col items-center gap-1 transition-all ${
              activeScreen === 'agenda' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <CheckSquare className="w-5 h-5" />
            <span className="text-[10px]">Agenda</span>
          </button>
          <button
            onClick={() => setActiveScreen('code')}
            className={`flex flex-col items-center gap-1 transition-all ${
              activeScreen === 'code' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Code2 className="w-5 h-5" />
            <span className="text-[10px]">Kotlin</span>
          </button>
          <button
            onClick={() => setActiveScreen('guide')}
            className={`flex flex-col items-center gap-1 transition-all ${
              activeScreen === 'guide' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span className="text-[10px]">Guía</span>
          </button>
        </div>

      </div >
    </div>
  );
}
