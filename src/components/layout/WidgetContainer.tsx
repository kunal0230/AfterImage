import Draggable from 'react-draggable';
import { useWidgetStore } from '../../store/useWidgetStore';
import { PomodoroWidget } from '../widgets/PomodoroWidget';
import { TaskWidget } from '../widgets/TaskWidget';
import { NotesWidget } from '../widgets/NotesWidget';
import { ClockWidget } from '../widgets/ClockWidget';
import { QuoteWidget } from '../widgets/QuoteWidget';
import { SoundMixer } from '../widgets/SoundMixer';

const widgetComponents: Record<string, React.ComponentType> = {
    pomodoro: PomodoroWidget,
    tasks: TaskWidget,
    notes: NotesWidget,
    clock: ClockWidget,
    quote: QuoteWidget,
    music: SoundMixer,
};

export function WidgetContainer() {
    const { widgets, updatePosition } = useWidgetStore();

    return (
        <div className="absolute inset-0 pointer-events-none z-20">
            {widgets
                .filter((w) => w.isVisible)
                .map((widget) => {
                    const Component = widgetComponents[widget.type];
                    if (!Component) return null;

                    return (
                        <Draggable
                            key={widget.id}
                            defaultPosition={widget.position}
                            onStop={(_, data) => updatePosition(widget.id, { x: data.x, y: data.y })}
                            bounds="parent"
                            handle=".drag-handle"
                        >
                            <div className="absolute pointer-events-auto cursor-move">
                                {/* Drag Handle */}
                                <div className="drag-handle absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-gray-300 rounded-full opacity-0 hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing" />
                                <Component />
                            </div>
                        </Draggable>
                    );
                })}
        </div>
    );
}
