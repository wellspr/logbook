export default function LogWriterContainerClient({ children }: { children: React.ReactNode }) {
    return (
        <div className="log-writer-container">
            {children}
        </div>
    );
}