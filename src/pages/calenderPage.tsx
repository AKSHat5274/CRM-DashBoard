import {
  CALENDAR_UPCOMING_EVENTS_QUERY,
  DASHBORAD_CALENDAR_UPCOMING_EVENTS_QUERY,
  TASKS_QUERY,
} from "@/graphql/queries";
import { useList, useShow } from "@refinedev/core";
import dayjs, { Dayjs } from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import utc from "dayjs/plugin/utc";
import { Badge, Calendar, Drawer, List, Skeleton } from "antd";
import { Text } from "../components/text";
import { CalendarProps } from "antd/lib";
import { useState } from "react";
import { GetFieldsFromList } from "@refinedev/nestjs-query";
import { CalendarEventsQuery, EventFragmentFragment, TasksQuery } from "@/graphql/types";
import { getDateColor } from "@/utilities";
import {
  Accordion,
  AccordionHeaderSkeleton,
  DescriptionForm,
  DescriptionHeader,
  DueDateForm,
  DueDateHeader,
  TitleForm,
  UsersForm,
  UsersHeader,
} from "@/components";
import { DeleteButton } from "@refinedev/antd";
import {
  AlignLeftOutlined,
  CalendarOutlined,
  FieldTimeOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { error } from "console";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import { getDate } from "@/utilities/helpers";

const CalenderPage = () => {
  const [current, setCurrent] = useState("");
  const [isTaskModalOpen, SetTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] =
    useState<GetFieldsFromList<TasksQuery>>();
    const [selectedEvent,setSelectedEvent]= useState <GetFieldsFromList<EventFragmentFragment>>();
  const [activeKey, setActiveKey] = useState<string | undefined>();
  dayjs.extend(isBetween);
  dayjs.extend(utc);


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
    // queryOptions: {
    //   enabled: !!stages,
    // },
    pagination: {
      mode: "off",
    },
    meta: {
      gqlQuery: TASKS_QUERY,
    },
  });
  const { data: upcomingEvents, isLoading: isLoadingEvents } = useList({
    resource: "events",
    pagination: { mode: "off" },
    sorters: [
      {
        field: "startDate",
        order: "asc",
      },
    ],
    filters: [
      {
        field: "startDate",
        operator: "gte",
        value: dayjs().format("YYYY-MM-DD"),
      },
    ],
    meta: {
      gqlQuery: CALENDAR_UPCOMING_EVENTS_QUERY,
    },
  });

  const colors = {
    success: "green",
    processing: "blue",
    error: "red",
    default: "teal",
    warning: "red",
  };
  // const events = (tasks?.data ?? []).map(
  //   ({ id, title, createdAt, dueDate }) => ({
  //     id: id,
  //     title: title,
  //     start: createdAt,
  //     end: dueDate || createdAt,
  //     color: colors[getDateColor({ date: dueDate || "default" })],
  //     allDay: dayjs(dueDate).utc().diff(dayjs(createdAt).utc(), "hours") >= 23,
  //     display:
  //       dayjs(dueDate).utc().diff(dayjs(createdAt).utc(), "hours") >= 23
  //         ? "block"
  //         : "list-item",
  //   })
  // );
  const eventsFinal = (upcomingEvents?.data ?? []).map(
    ({ id, title, startDate, endDate, color,description,participants }) => ({
      id: id,
      title: title,
      color: color,
      start: startDate,
      end: endDate,
      description:description,
      participants:participants,
      allDay: dayjs(endDate).utc().diff(dayjs(startDate).utc(), "hours") >= 23,
    })
  );
  const [isLoading, setIsLoading] = useState(false);
  console.log(upcomingEvents, "upcoming events");

  return (
    <>
      {isLoading ? (
        <Drawer open={true}>
          <AccordionHeaderSkeleton />
        </Drawer>
      ) : (
        <Drawer
          title={
            // <TitleForm
            //   initialValues={{ title: selectedEvent?.title }}
            //   isLoading={isLoadingTasks}
            // />
            <h2 color={selectedEvent?.color}
            
            >{selectedEvent?.title}
            </h2>
          }
          open={isTaskModalOpen}
          onClose={() => {
            SetTaskModalOpen(false);
            setSelectedEvent(null);
          }}
          width={586}
          
        >
          <div>
            <Accordion
              accordionKey="description"
              activeKey={activeKey}
              setActive={setActiveKey}
              fallback={
                // <DescriptionHeader description={selectedEvent?.description} />
                <p style={{font:"message-box",fontSize:'20px'}}>{selectedEvent?.description}</p>
              }
              isLoading={isLoadingTasks}
              icon={<AlignLeftOutlined />}
              label="Description"
            >
             <p style={{font:"message-box",fontSize:'20px'}}>{selectedEvent?.description}</p>
            </Accordion>
            <Accordion
              accordionKey="due-date"
              activeKey={activeKey}
              setActive={setActiveKey}
              fallback={<Text size='md'>{getDate(selectedEvent?.startDate,selectedEvent?.endDate)}</Text>}
              isLoading={isLoadingTasks}
              icon={<FieldTimeOutlined />}
              label="Dates"
            >
              {/* <DueDateForm
                initialValues={{ dueDate: selectedEvent?.endDate ?? undefined }}
                cancelForm={() => setActiveKey(undefined)}
              /> */}
              
              {/* <CalendarOutlined/> */}
              <Text  size='md'>{getDate(selectedEvent?.startDate,selectedEvent?.endDate)}</Text>
              
            </Accordion>

            {/* Render the users form inside an accordion */}
            <Accordion
    accordionKey="users"
    activeKey={activeKey}
    setActive={setActiveKey}
    fallback={<UsersHeader users={ selectedEvent?.participants} />}
    isLoading={isLoadingTasks}
    icon={<UsergroupAddOutlined />}
    label="Users"
  >
    <UsersForm
      initialValues={{
        userIds: selectedEvent?.participants?.map((user) => ({
          label: user.name,
          value: user.id,
        })),
      }}
      cancelForm={() => setActiveKey(undefined)}
    />
  </Accordion>
          </div>
        </Drawer>
      )}

      <div>
        <h1>Events Calendar</h1>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, listPlugin]}
          initialView={"dayGridMonth"}
          events={eventsFinal}
          eventTimeFormat={{
            hour: "2-digit",
            minute: "2-digit",
            // meridiem: false,
          }}
          dragScroll
          eventClick={(event) => {
            SetTaskModalOpen(true);
            console.log(selectedEvent);
           setSelectedEvent(upcomingEvents?.data?.find(({ id }) => id === event?.event?._def?.publicId) as Event)
          }}
        />
        {/* <Calendar cellRender={cellRender} mode="month" fullscreen onPanelChange={()=>false} onChange={()=>false} onSelect={()=>false} value={dayjs()} validRange={[dayjs(),dayjs().add(31,"days")]}/> */}
      </div>
    </>
  );
};
export default CalenderPage;
