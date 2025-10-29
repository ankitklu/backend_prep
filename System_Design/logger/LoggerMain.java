package logger;
import java.util.*;

interface LogClient{
    /*
     * When a process starts, it calls 'start' with processId
     */
    void start(String processId);


    /*
     * When a process ends, it calls 'end' with processId
     */
    void end(String processId);

    /*
     * Polls the first log entry of a completed process sorted by the start time of
     * process sorted by the start time of processes in the beow
     * format
     * {processId} started at {startTime} and ended at {endTime}
     * 
     * process id = 1 --> 12, 15
     * process id = 2 --> 8, 12
     * process id = 3 --> 7, 19
     * 
     * {3} started at {7} and ended at {19}
     * {2} started at {8} and ended at {12}
     * {1} started at {12} and ended at {15}
    */
    void poll();
}

class LoggerImplemetnation implements LogClient{

    private final Map<String, Process> processes;
    private final TreeMap<Long, Process> queue;

    public LoggerImplemetnation(){
        this.processes = new HashMap<>();
        this.queue = new TreeMap<>(Comparator.comparingLong(startTime -> startTime));
    }


    // O(1)
    @Override
    public void start(String processId) {
        final long now = System.currentTimeMillis();
        final Process process = new Process(processId, now);
        processes.put(processId, new Process(processId, now));
        processes.put(processId, process);
        queue.put(now, process);
    }

    @Override
    public void end(String processId) {
        final Process process = queue.firstEntry().getValue();
        final long now = System.currentTimeMillis();
        processes.get(processId).setEndTime(System.currentTimeMillis());
        queue.put(now, process);
    }

    @Override
    public void poll() {
        final Process process = queue.firstEntry().getValue();
        if(process.getEndTime()!=-1){
            System.out.println(process.getId() + " started at " + process.getStartTime() + " and ended at " + process.getEndTime());
            processes.remove(process.getId());
            queue.pollFirstEntry();
        }
        else{
            System.out.println("No completed process to poll: "+ queue.size());
        }
    }
}


class Process{
    private final String id;
    private final long startTime;
    private long endTime;

    public Process(String id, final long startTime){
        this.id=id;
        this.startTime = startTime;
        endTime = -1;
    }

    public String getId(){
        return this.id;
    }

    public long getStartTime(){
        return this.startTime;
    }

    public void setEndTime(final long endTime){
        this.endTime = endTime;
    }

    public long getEndTime(){
        return this.endTime;
    }

}
public class LoggerMain{
    /*
     * {3} started at {7} and ended at {19}
     * {2} started at {8} and ended at {12}
     * {1} started at {12} and ended at {15}
    */
    public static void main(String args[]){
        final LogClient logger = new LoggerImplemetnation();
        logger.start("1");
        logger.poll();
        logger.start("2");
        logger.poll();
        logger.end("2");
        logger.poll();
        logger.start("3");
        logger.poll();
        logger.end("1");
        logger.poll();
        logger.end("3");
        logger.poll();

    }
}