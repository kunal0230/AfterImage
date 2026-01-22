import { useRef } from 'react';
import Draggable from 'react-draggable';
import { useWidgetStore } from '../../store/useWidgetStore';
import type { Widget } from '../../store/useWidgetStore';
import { PomodoroWidget } from '../widgets/PomodoroWidget';
import { TaskWidget } from '../widgets/TaskWidget';
import { NotesWidget } from '../widgets/NotesWidget';
import { ClockWidget } from '../widgets/ClockWidget';
import { QuoteWidget } from '../widgets/QuoteWidget';
import { SoundMixer } from '../widgets/SoundMixer';
import { BreathingWidget } from '../widgets/BreathingWidget';
import { MediaWidget } from '../widgets/MediaWidget';
import { AnimatePresence } from 'framer-motion';

const widgetComponents: Record<string, React.ComponentType> = {
    pomodoro: PomodoroWidget,
    tasks: TaskWidget,
    notes: NotesWidget,
    clock: ClockWidget,
    quote: QuoteWidget,
    music: SoundMixer,
    breathing: BreathingWidget,
    media: MediaWidget,
};

export function WidgetContainer() {
    const { widgets } = useWidgetStore();

    return (
        <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
            <AnimatePresence>
                {widgets
                    .filter((w) => w.isVisible)
                    .map((widget) => (
                        <DraggableWidget key={widget.id} widget={widget} />
                    ))}
            </AnimatePresence>
        </div>
    );
}

function DraggableWidget({ widget }: { widget: Widget }) {
    const { updatePosition } = useWidgetStore();
    const nodeRef = useRef<HTMLDivElement>(null);
    const Component = widgetComponents[widget.type];

    if (!Component) return null;

    return (
        <Draggable
            nodeRef={nodeRef}
            defaultPosition={widget.position}
            onStop={(_, data) => updatePosition(widget.id, { x: data.x, y: data.y })}
            bounds="parent"
            handle=".drag-handle"
        >
            <div
                ref={nodeRef}
                className="absolute pointer-events-auto"
                style={{ width: 'max-content' }}
            >
                <Component />
            </div>
        </Draggable>
    );
}
