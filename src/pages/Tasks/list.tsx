import { ProjectCardSkeleton } from '@/components'
import { KanbanAddCardButton } from '@/components/tasks/kanban/add-card-button'
import { KanBanBoard, KanBanBoardContainer } from '@/components/tasks/kanban/board'
import { ProjectCard, ProjectCardMemo } from '@/components/tasks/kanban/card'
import KanBanCollumn, { KanbanColumnSkeleton } from '@/components/tasks/kanban/column'
import KanBanItem from '@/components/tasks/kanban/item'
import { UPDATE_TASK_STAGE_MUTATION } from '@/graphql/mutations'
import { TASKS_QUERY, TASK_STAGES_QUERY } from '@/graphql/queries'
import {  TaskUpdateInput } from "@/graphql/schema.types";
import { TasksQuery, TaskStagesQuery } from "@/graphql/types";
// import { TasksQuery } from '@/graphql/types'
import { DragEndEvent } from '@dnd-kit/core'
import { HttpError, useList, useNavigation, useUpdate } from '@refinedev/core'
import { GetFieldsFromList } from '@refinedev/nestjs-query'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const TaskList = ({children}:React.PropsWithChildren) => {
    const {replace}= useNavigation()
    type Task = GetFieldsFromList<TasksQuery>;
type TaskStage = GetFieldsFromList<TaskStagesQuery> & { tasks: Task[] };
    const { data: stages, isLoading: isLoadingStages } = useList<TaskStage>({
        resource: "taskStages",
        filters: [
          {
            field: "title",
            operator: "in",
            value: ["TODO", "IN PROGRESS", "IN REVIEW", "DONE"],
          },
        ],
        sorters: [
          {
            field: "createdAt",
            order: "asc",
          },
        ],
        meta: {
          gqlQuery: TASK_STAGES_QUERY,
        },
      });
    
      const { data: tasks, isLoading: isLoadingTasks } = useList<
        GetFieldsFromList<TasksQuery>
      >({
        resource: "tasks",
        sorters: [
          {
            field: "dueDate",
            order: "asc",
          },
        ],
        queryOptions: {
          enabled: !!stages,
        },
        pagination: {
          mode: "off",
        },
        meta: {
          gqlQuery: TASKS_QUERY,
        },
      });
    const taskStages= React.useMemo(()=>{
        if(!tasks?.data||!stages?.data){
            return {
                unnassignedStages:[],
                stages:[]
            }
        }
        const grouped: TaskStage[] = stages.data.map((stage) => ({
            ...stage,
            tasks: tasks.data.filter((task) => task.stageId?.toString() === stage.id),
          }));
        const unassignedStages=tasks.data.filter((task)=>task.stageId===null)
        return{
            unassignedStages,
            columns:grouped
        }
    },[stages,tasks])
    const { mutate: updateTask } = useUpdate<Task, HttpError, TaskUpdateInput>();
    // console.log(taskStages,"taskStages")
    const isLoading= isLoadingStages||isLoadingTasks
    const handleAddCard=(args:{stageId:string})=>{
        const path= args.stageId==='unassigned'?'/tasks/new':`/tasks/new?stageId=${args.stageId}`
        replace(path);
    }
   
    if(isLoading) return <PageSkeleton/>


    const handleOnDragEnd = (event: DragEndEvent) => {
      let stageId = event.over?.id as undefined | string | null;
      const taskId = event.active.id as string;
      const taskStageId = event.active.data.current?.stageId;
  
      if (taskStageId === stageId) {
        return;
      }
  
      if (stageId === "unassigned") {
        stageId = null;
      }
  
      updateTask({
        resource: "tasks",
        id: taskId,
        values: {
          stageId: stageId,
        },
        successNotification: false,
        mutationMode: "optimistic",
        meta: {
          gqlMutation: UPDATE_TASK_STAGE_MUTATION,
        },
      });
    };
  
    // const handleAddCard = (args: { stageId: string }) => {
    //   const path =
    //     args.stageId === "unassigned"
    //       ? "/tasks/new"
    //       : `/tasks/new?stageId=${args.stageId}`;
  
    //   replace(path);
    // };
  
  return (
    <>
    <KanBanBoardContainer>
        <KanBanBoard onDragEnd={handleOnDragEnd}>
        <KanBanCollumn
        id="unassigned"
        title={'unassigned'}
        count={taskStages.unassignedStages?.length||0}
        onAddClick={()=>handleAddCard({stageId:'unassigned'})}
        >
           {taskStages.unassignedStages?.map((tasks)=>(
            <KanBanItem key={tasks.id} id={tasks.id} data={{...tasks,stageId:"unasigned"}}>
                <ProjectCardMemo {...tasks} dueDate={tasks.dueDate||undefined}/>
            </KanBanItem>
           ))}
           {!taskStages.unassignedStages?.length && (
            <KanbanAddCardButton
            onClick={()=>
            handleAddCard({
                stageId:'unasigned'
            })}
            />
           )}
        </KanBanCollumn>
        {taskStages.columns?.map((column)=>(
            <KanBanCollumn
            key={column.id}
            id={column.id}
            title={column.title}
            count={column.tasks?.length}
            onAddClick={()=>handleAddCard({stageId:column.id})}
            >
                {!isLoading && column.tasks.map((task)=>(
                    <KanBanItem key={task.id} id={task.id} data={task}>
                       <ProjectCardMemo {...task} dueDate={task.dueDate||undefined}/>
                    </KanBanItem>
                ))}
                {!isLoading && !column.tasks.length &&(
                     <KanbanAddCardButton
                     onClick={()=>
                     handleAddCard({
                         stageId:'unasigned'
                     })}
                     />
                )}
            </KanBanCollumn>

        ))}
        {/* <KanBanCollumn>
        <KanBanItem>

        </KanBanItem>
        </KanBanCollumn> */}
        </KanBanBoard>
    </KanBanBoardContainer>
    {children}
    </>
  )
}
const PageSkeleton = () => {
    const columnCount = 6;
    const itemCount = 4;
  
    return (
      <KanBanBoardContainer>
        {Array.from({ length: columnCount }).map((_, index) => {
          return (
            <KanbanColumnSkeleton key={index}>
              {Array.from({ length: itemCount }).map((_, index) => {
                return <ProjectCardSkeleton key={index} />;
              })}
            </KanbanColumnSkeleton>
          );
        })}
      </KanBanBoardContainer>
    );
  };

export default TaskList